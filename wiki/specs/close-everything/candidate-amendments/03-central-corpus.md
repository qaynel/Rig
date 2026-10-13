# Subplan 03 candidate amendments — central corpus

**Status: CANDIDATE, unsigned.** Prepared 2026-10-13 under the close-everything
plan ([central corpus](../03-central-corpus.md)). Frozen files under
`wiki/gate1/` and the tests pinned in `wiki/gate1/testing-infrastructure.manifest`
were **not** edited. The owner applies these diffs in the single batched
re-sign; agents never sign. Each section is one amendment; later slices append
sections here.

## A1. AT-HOST-5 — `materializeSelectedHosts` is removed (RIG-125 / RIG-132)

- File: `tests/advanced-oracle.test.js` (pinned), case `AT-HOST-5 unsupported MCP
  emits nothing and preserves user files` (about line 345).
- Why: `materializeSelectedHosts` had zero production callers and kept a second
  MCP-disposition table that bypassed `MCP_HOSTS`. It is deleted, so the
  frozen case that calls it fails. The same property (an unsupported MCP host
  emits nothing and leaves user files alone) is asserted against the one table
  and the real emission path, `materializeHostAdapters`.
- Production callers checked before removal: none (`grep -rn
  materializeSelectedHosts rig scripts hooks` returned only its definition).
  Non-frozen callers (`tests/advanced-hosts.test.js`) now read `MCP_HOSTS`.
- Unsigned runnable copy of the amended case:
  `03-central-corpus/at-host-5.candidate.test.js`
  (`node --test wiki/specs/close-everything/candidate-amendments/03-central-corpus/at-host-5.candidate.test.js`).

```diff
--- a/tests/advanced-oracle.test.js
+++ b/tests/advanced-oracle.test.js
@@ test('AT-HOST-5 unsupported MCP emits nothing and preserves user files', () => {
   h.withRepo((target) => {
     const userFile = path.join(target, '.omp', 'mcp.json');
     fs.mkdirSync(path.dirname(userFile), { recursive: true });
     fs.writeFileSync(userFile, '{"user":true}\n');
-    const result = api('host-capabilities.js', 'materializeSelectedHosts')(target, ['pi']);
-    assert.equal(fs.readFileSync(userFile, 'utf8'), '{"user":true}\n');
-    assert.equal(result.pi.mcp.status, 'unsupported');
-    assert.match(result.pi.mcp.guidance, /preserv/i);
+    api('host-capabilities.js', 'materializeHostAdapters')(target, 'pi');
+    const { MCP_HOSTS } = require('../rig/lib/mcp-hosts');
+    assert.equal(fs.readFileSync(userFile, 'utf8'), '{"user":true}\n');
+    assert.equal(MCP_HOSTS.pi.emission, 'unsupported');
+    assert.equal(MCP_HOSTS.pi.autoWrite, false);
+    const descriptor = JSON.parse(fs.readFileSync(path.join(target, '.rig/host-contracts/pi/mcp_config.json'), 'utf8'));
+    assert.equal(descriptor.emission, 'unsupported');
+    assert.equal(descriptor.auto_write, false);
+    assert.equal(fs.existsSync(path.join(target, '.mcp.json')), false);
   });
 });
```

Mutation check (recorded 2026-10-13, throwaway copy `/tmp/rig03/mut`): making
`pi` auto-write in `rig/lib/mcp-hosts.js` fails the candidate (fail 1) and the
unmutated tree passes it (pass 1). Production code was not touched.

Frozen-suite effect until applied: exactly one frozen case is red,
`AT-HOST-5`, on this branch.
