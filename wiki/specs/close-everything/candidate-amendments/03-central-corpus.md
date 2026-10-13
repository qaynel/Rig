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

## A2. Third-party fetch (slice 4) — no frozen-test change yet; one pending amendment recorded

Fetch metadata, patches and the verify/patch pipeline are additive: the shelf
under `rig/catalog/skills/` still ships and AT-PB-3 (55 staged SKILL.md files)
and the licence checks stay green byte-for-byte. The pipeline reproduces the
four RIG-135 runtime files exactly from the pinned upstream revision (tested),
which proves the patches apply; it does not yet replace the whole shelf.

Pending amendment (not applied, needs the owner's re-sign): to drop the
vendored 6.9 MB shelf from the install and stage it by fetch, AT-PB-3's
`staged.length === 55` check and the `.rig/runtime/rig/catalog/skills` staging
assertions in `tests/path-b-catalog.test.js`, `tests/path-b-weight.test.js` and
`tests/path-b-hardening.test.js` (the last is not pinned) change to "55 after
fetch". 83 of the 298 shelf files also carry Rig-authored changes beyond the
rename (catalogue frontmatter, neutralised strings, RIG-135 code) that are not
reproducible from upstream bytes alone; those need an overlay in the corpus
before whole-shelf fetch is possible. Recorded as a remaining gap, not hidden.
