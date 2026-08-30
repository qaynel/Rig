# RIG-149 — Technical Specification

**Produced:** 2026-08-30  
**Status:** Working design — not frozen. Implementation adapts to this; oracle is frozen separately.

---

## Current-state trace

`installVendoredSkillsOp` (`rig/lib/payload.js:91–113`) iterates every dir
returned by `listVendoredSkills()`, computes:

```js
const finalName = `${prefix}${skill.name}`;   // payload.js:102
```

and passes the same prefix to `rewriteSkillName`, which stamps the
frontmatter `name:` to match the installed path:

```js
return rewriteSkillName(contents.toString('utf8'), prefix, skill.name);  // :110
```

For the `claude` host entry, `prefix = "rig-"` (from `manifest.json:45`).

`rig/catalog/skills/_core/SKILL.md` declares `name: rig`. So:

- `finalName` = `"rig-" + "rig"` = `"rig-rig"`
- Directory: `.claude/skills/rig-rig/`
- Frontmatter rewritten to `name: rig-rig`

`routing.md:100–102` names the skill as `` `rig` `` in its fallback. No skill
addressable as `rig` exists in `.claude/skills/` after install.

---

## Chosen approach

**Exempt a skill from the prefix when its declared name already equals the prefix
stem** (the prefix without the trailing dash).

This is a 3-line change, entirely inside `installVendoredSkillsOp`. No changes
to `skills.js`, `manifest.json`, or `routing.md`.

### Touched seam — `rig/lib/payload.js` lines 100–111

Replace the single `prefix` reference with a per-skill effective prefix:

```js
for (const skill of skills) {
  const src = path.join(ROOT, 'rig', 'catalog', 'skills', skill.dir);
  const stem = prefix.replace(/-$/, '');                                     // "rig-" → "rig"
  const effectivePrefix = (prefix && skill.name === stem) ? '' : prefix;    // _core exemption
  const finalName = `${effectivePrefix}${skill.name}`;
  const rel = destPattern.replace('{name}', finalName);
  const skillMd = path.join(src, 'SKILL.md');
  copyTree(target, src, rel, writeFile, (sourcePath, contents) => {
    if (sourcePath !== skillMd) return contents;
    return rewriteSkillName(contents.toString('utf8'), effectivePrefix, skill.name);
  }, filter);
}
```

**Invariants preserved:**
- Neutral host (prefix `''`): `stem = ''`, condition `prefix && ...` is false →
  `effectivePrefix = ''`. No change for neutral installs.
- Claude/Codex (prefix `'rig-'`), skill name `'rig'`: `stem = 'rig'`, condition
  true → `effectivePrefix = ''`. Installs at `.claude/skills/rig/`, frontmatter
  `name: rig`.
- Claude/Codex, any other skill (e.g. `'rig-upgrade'`, `'grilling'`): condition
  false → `effectivePrefix = 'rig-'`. Unchanged.

---

## Rejected alternatives

**Option B — update `routing.md` to name `rig-rig`:**  
The installed name `rig-rig` is a side-effect of a blanket rule, not a deliberate
choice. Baking it into routing documentation makes the documentation wrong by
definition (the install is broken; the fix is not to canonise the breakage).
Rejected.

**Option C — add a frontmatter flag (`no-prefix: true`) to `_core/SKILL.md`:**  
Adds a new SKILL.md field the installer must read, increasing coupling between
catalog content and installer logic, and requires updating the skill file alongside
the installer. The semantic rule (name == stem → no doubling) is derivable without
any new field and is correct for any future skill that falls into the same pattern.
Rejected.

**Option D — rename `_core`'s frontmatter to `rig-core` so no doubling occurs:**  
Breaks the neutral-host install (`.rig/skills/rig-core/`, not `.rig/skills/rig/`)
and changes the skill's invocation name away from what `routing.md` expects.
Rejected.

---

## Slices and verification

**Slice 1 — fix `installVendoredSkillsOp` in `payload.js`**

Edit lines 100–111 as above (3-line diff).

Verify:
```sh
npm run test:rig
```
Expected: 9 tests, 9 pass (the RIG-149 test goes green; no regressions).

**Slice 2 — full gate**

```sh
npm test
```
Expected: green.

---

## Data, safety, and failure boundaries

- Change is local to `installVendoredSkillsOp` — no disk writes outside the
  normal install target; no network; no concurrency concern.
- The exemption condition requires both `prefix` to be truthy AND `skill.name`
  to exactly equal the stem. An empty prefix or a name that merely starts with
  the stem does not trigger it.
- No migration needed: a fresh install corrects the path. Existing repos with
  `rig-rig/` installed keep it until they re-run bootstrap; that is acceptable
  — re-running bootstrap is the documented upgrade path.

---

## Risks

None requiring a return to grilling. The fix is a single-point, two-condition
guard on an existing loop with complete test coverage for the corrected behaviour.
