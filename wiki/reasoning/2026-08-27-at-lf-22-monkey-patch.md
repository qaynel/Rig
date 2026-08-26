# AT-LF-22: Production monkey-patch in net.Server.listen weakens network trust

**Date:** 2026-08-27  
**Context:** Code review of `rig/lib/lint-format.js` lines 11-22 during RIG-120 release prep  
**Finding:** Production code globally monkey-patches Node.js's `net.Server.prototype.listen` to work around a frozen test's timing issue.
**Ticket:** [[RIG-137]] (GitHub #91)

## The Monkey-Patch

```javascript
// rig: frozen AT-LF-22 does listen(0, '127.0.0.1') then address() immediately.
// Node 24 looks up the host asynchronously, so address() is null and the case
// throws before runReadOnly. Dropping the loopback host binds synchronously;
// IPv6 :: still accepts 127.0.0.1.
{
  const net = require('node:net');
  const listenTcp = net.Server.prototype.listen;
  net.Server.prototype.listen = function listen(port, host, ...rest) {
    if (port === 0 && host === '127.0.0.1') return listenTcp.call(this, 0, ...rest);
    return listenTcp.call(this, port, host, ...rest);
  };
}
```

## The Problem

1. **Global scope**: The patch affects every caller in the entire process that binds to `listen(0, '127.0.0.1')`, not just the frozen test.

2. **Silent behavior change**: Any real production code expecting strict loopback-only binding silently gets wildcard binding instead, which accepts connections from all interfaces and other processes.

3. **Contradicts the goal**: AT-LF-22 is explicitly about "default-deny network reachability" and tightening trust. This patch weakens it by allowing wildcard binding in production code.

4. **Production code shipping a test workaround**: The hack is embedded in production code that gets loaded by every Rig user, not isolated to test infrastructure.

## Why It's There

The frozen AT-LF-22 test does `listen(0, '127.0.0.1')` then immediately calls `address()`. In Node 24, host lookup became asynchronous, so `address()` returns null too soon and throws. The patch makes the bind synchronous by dropping the host, so the wildcard bind completes before `address()` is called.

## Options to Fix

1. **Unfreeze and fix the test** — rewrite AT-LF-22 to not require synchronous `address()`, handle null gracefully, or use a different loopback strategy. Solves root cause but requires unfreezing the test oracle.

2. **Move the patch to test code only** — wrap it in test setup/teardown instead of shipping it in production. Isolates the hack but leaves the root-cause timing issue unaddressed in real code.

3. **Narrow workaround scope** — only patch inside a specific test execution context or `runReadOnly` scope, not globally. Reduces blast radius while keeping test frozen.

4. **Use a different test strategy** — instead of relying on `address()`, use a different method to verify the port (connect to it, check process state, etc.) that doesn't require synchronous lookups.

**Recommendation:** Option 1 (unfreeze and fix) is cleanest because:
- The frozen status likely applies to acceptance criteria, not implementation details
- It solves the real timing issue instead of hiding it
- It keeps production code clean
- The test's observable behavior (network isolation) doesn't change, only the implementation

If the test truly cannot be unfrozen, Option 3 (narrow scope) is second-best — at least production code stops being affected globally.
