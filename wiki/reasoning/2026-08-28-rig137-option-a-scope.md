---
date: 2026-08-28
source: intent owner
topics: trust-and-failure-boundaries
decisions:
status: historical
---

Grilled RIG-137 (#91) with the intent owner before touching code.

**Question asked first:** do we have enough context to proceed with Option B
(move the monkey-patch into test setup)? Investigation found Option B isn't a
pure code move: the only two places a "test setup" landing spot could exist —
`tests/advanced-oracle.test.js` (the frozen `AT-LF-22` test itself) and
`tests/helpers/advanced.js` (its helper, also frozen and byte-pinned in
`wiki/gate1/testing-infrastructure.manifest`) — are both inside the signed
oracle. `node --test` runs each test file in its own process and
`package.json`'s scripts block is separately frozen, so there is no
non-frozen setup hook the frozen test would actually pick up. Either option
therefore requires a key-holder re-sign, not just a green CI run.

Surfaced that the ticket and its reasoning trace
([[2026-08-27-at-lf-22-monkey-patch]]) both recommend Option A over Option B.
Owner chose **Option A**: unfreeze and correctly fix `AT-LF-22`'s timing,
delete the production patch outright.

**Root cause verified empirically**, not just taken from the ticket, on this
repo's Node v24.18.0:

```
$ timeout 5 node -e "
  const net = require('node:net');
  const server = net.createServer((s) => s.end());
  server.listen(0, '127.0.0.1');
  console.log(server.address());
  server.close();
"
null
```

and a 2-second busy-spin re-checking `server.address()` with no event-loop
yield never observes a non-null result. Binding now completes on an
event-loop tick even for a literal IP; a thread that never yields (spin loop,
`Atomics.wait`) can't observe that completion because the completion itself
needs the event loop to run — it would deadlock, not just be slow. The only
correct synchronization point is `listen(port, host, callback)` / the
`'listening'` event, which means the test has to become `async`.

Considered and rejected: picking a fixed port to avoid `address()` entirely.
That removes the synchronization guarantee `address()` currently provides
(non-null only once actually listening), not just the async requirement —
the test could then pass vacuously if the probe raced ahead of the bind,
which is a worse failure mode than the one being fixed.

**Scope decision (owner, explicit):** fix only `AT-LF-22`. Do not make
`tests/helpers/advanced.js`'s `withTempDir`/`withRepo` async-aware as part of
this ticket, even though the investigation established why the existing
helper can't safely wrap an async callback (its `try { return fn(dir) }
finally { rmSync(dir) }` deletes the temp dir the instant the promise is
*returned*, not when it *settles*). Generalizing the helper is defensible
engineering but is a second change with a different justification —
expanding the frozen/signed surface with no present second caller. Deferred
until a second or third test actually needs an async fixture lifetime; then
it's its own deliberate infrastructure change, not smuggled in under a
security-regression fix.

**What ships (owner-approved draft, pending key-holder re-sign):**

1. Delete the entire `net.Server.prototype.listen` patch from
   `rig/lib/lint-format.js`.
2. Rewrite `AT-LF-22` (title unchanged, so the oracle's title/ID trace check
   stays satisfied with no changes elsewhere) to:
   - build its own temp repo inline (`fs.mkdtempSync` + `h.initGitRepo`),
     bypassing `h.withRepo`/`withTempDir` rather than modifying them;
   - `await` the `'listening'` callback before reading `server.address()`;
   - run the existing probe/assertion unchanged;
   - `await` `server.close()`'s callback (not a bare `server.close()`) so
     teardown is deterministic and doesn't grow its own timing workaround;
   - clean up the temp dir explicitly in a `finally`.
3. Update `wiki/gate1/testing-infrastructure.manifest`'s hash for
   `tests/advanced-oracle.test.js` only — `tests/helpers/advanced.js`'s entry
   is untouched, unchanged file — and get the key-holder re-sign.
4. Run the full gate (`npm test`).

Draft rewrite:

```js
test('AT-LF-22 a task has no network reachability without an explicit grant', async () => {
  const net = require('node:net');
  const runReadOnly = api('lint-format.js', 'runReadOnly');
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-advanced-'));
  try {
    h.initGitRepo(target);
    const server = net.createServer((socket) => socket.end());
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const { port } = server.address();
    try {
      const probe = path.join(target, 'net-check.js');
      fs.writeFileSync(probe, `
        const net = require('net');
        const done = () => process.exit(0);
        setTimeout(done, 800);
        const sock = net.createConnection({ host: '127.0.0.1', port: ${port} }, () => {
          require('fs').writeFileSync('connected', 'x');
          sock.end();
          done();
        });
        sock.on('error', done);
      `);
      runReadOnly(target, [{ argv: [process.execPath, probe] }]);
      assert.equal(fs.existsSync(path.join(target, 'connected')), false);
    } finally {
      await new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    }
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});
```

Acceptance for the freeze: `rig/lib/lint-format.js` has zero references to
`net.Server.prototype` / `require('node:net')`; `AT-LF-22` passes as rewritten
on the current runtime with the production patch gone; full `npm test` green;
manifest hash updated and re-signed.

Not this agent's call to make: per the gate contract, an agent may draft the
oracle change but the frozen test file can only be edited by the key holder's
re-sign. This trace is the draft handed over; it is not itself the edit.

## Addendum: canonical-branch decision (2026-08-28, later same day)

A parallel, uncoordinated fix for RIG-137 was discovered on a sibling
Conductor workspace (`mogadishu`, branch `rig-137-monkey-patch`, commit
`69db079`): same production-patch deletion, but `AT-LF-22` fixed by dropping
the `'127.0.0.1'` host argument (`server.listen(0)`), which resolves
synchronously on current Node — verified empirically:

```
$ node -e "server.listen(0); console.log(server.address())"
{ address: '::', family: 'IPv6', port: ... }   # synchronous, no host given
```

That's a genuinely smaller diff (no `async`, no bypassing `h.withRepo`) and
was surfaced as an option this trace's investigation missed (it only tested
an *explicit* loopback host, not omitting the host). It was **rejected as
canonical** by the owner: `listen()`'s async behavior and the `'listening'`
event as the synchronization point are Node's documented contract; a bare
`listen(0)` returning a populated `address()` synchronously is incidental
runtime behavior, not a guarantee, and not something to anchor a frozen
oracle test to. It also drops the fixture's loopback-only bind for no
compensating benefit — semantic drift with no upside once the production
patch (the actual RIG-137 harm) is already deleted either way.

**Canonical:** this trace's async `AT-LF-22` rewrite (kept `'127.0.0.1'`,
awaits `'listening'`, awaits `server.close()`), on branch
`rig-137-option-a-scope`. `mogadishu`'s `rig-137-monkey-patch` branch is
superseded — notified via cross-session message; do not sign or merge its
manifest change.

Gate1 signing was attempted from this workspace and correctly refused: no
`RIG_GATE1_SIGNING_KEY` / `.credentials/gate1.env` here, so the actual
cryptographic re-sign has to happen on the key holder's own machine (the
existing `gate1.allowed-signers` principal is a Secretive-backed key, not
something this session can hold). `node scripts/approve-gate1.js status`
correctly reports the manifest as changed pending that re-sign.
