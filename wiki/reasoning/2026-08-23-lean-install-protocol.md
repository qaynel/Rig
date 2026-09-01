---
date: 2026-08-23
source: agent
topics: distribution-and-release, the-catalogue, install-manifest-removal
decisions: AD-37
status: historical
---

# Lean install — implementation spec

Target: a new branch off `qa-prod` (or off the current v4 branch). Goal: a
default `sh rig/bootstrap.sh` install writes **markdown/instructions only** into
the target repo; all executable backing (per-skill code + the plumbing tree)
ships only under the existing `--with-runtime` opt-in. Honors the CLAUDE.md
markdown-only invariant. **No oracle re-sign required** (proven below).

---

## 1. Current state (traced)

- `rig/bootstrap.sh` already parses `--with-runtime` → `ACTIVE_DELIVERY=1` →
  `runPayload(..., { activeDelivery })`. The gate mechanism exists and works.
- `rig/lib/payload.js` `runPayload` skips entries with
  `gate === 'active_delivery'` when `activeDelivery` is false. The **runtime
  engine** (`rig/manifest.json` lines 58–67: materialize.js, lib, catalog
  baseline/services, network policy) is correctly gated this way.
- **The bloat is ungated.** In `rig/manifest.json`:
  - lines 44–46: three `install_vendored_skills` ops — copy each skill dir
    *wholesale* (`installVendoredSkillsOp` → `copyTree`), including `src/*.ts`,
    `*.swift`, `bin/*`, `scripts/*`, and `*.tmpl` build inputs.
  - line 56: `copy_tree rig/catalog/plumbing → .rig/plumbing` — pure code
    (`.ts`/`.sh`/bins).
- Measured footprint of a default install today: skills tree **6.8 MB**,
  plumbing **1.1 MB**; **201 non-markdown files** in the skills tree
  (112 `.ts`, 71 `.tmpl`, 15 `.sh`, 2 `.swift`, …). Heavy backing concentrates in
  `browse` (68 files), `ios-qa` (25), `make-pdf` (13), `rig-upgrade` (10).
- Markdown-only content of the skills tree is **~3.9 MB / 99 `.md` files**.

### What "lean default" produces

| | Today (default) | Lean (default) | Lean (`--with-runtime`) |
|---|---|---|---|
| Skill `SKILL.md` + `.md` | ✓ | ✓ | ✓ |
| Notice files (LICENSE.upstream, UPSTREAM.md, README.md) | ✓ | ✓ | ✓ |
| Per-skill code (`src/`, `bin/`, `scripts/`, `daemon/`, `.swift`) | ✓ | **✗** | ✓ |
| `.rig/plumbing` tree | ✓ | **✗** | ✓ |
| `.tmpl` build inputs + `TODOS-format.md` | ✓ (litter) | **✗** | **✗** |
| Non-markdown files landed | 201 | **0** | 201 |

The MB cut is ~7.9 → ~4.0 MB, but the number that matters for "won't break
other people's machines" is **201 → 0 executable/code files**. All 55 skills
remain present and callable by Rig name (their `SKILL.md` still lands), so the
shelf is intact as instruction content.

---

## 2. Why no re-sign is needed (verified)

The owner signature covers exactly three artifacts (`scripts/check-advanced-spec.js`
`oracleMessage`): `wiki/gate1/business-spec.md`, `wiki/gate1/acceptance.md`, and
`wiki/gate1/testing-infrastructure.manifest`. That manifest digests only **five
files**:

```
scripts/check-advanced-spec.js
tests/advanced-oracle.test.js
tests/advanced-spec-gate.test.js
tests/helpers/advanced.js
wiki/gate1/package-scripts.json
```

- `tests/vendored-skills-install.test.js`, `tests/rig-bootstrap.test.js`, and
  `tests/context-aware-onboarding.test.js` are **not** signed — free to edit.
- The only frozen install case is **AT-DIST-1** in `tests/advanced-oracle.test.js`
  (lines 477–491). It asserts: `install.sh` shape (no `curl|sh`, has
  `latest|--version`), `package.json` version `5.0.0`, `listVendoredSkills()`
  returns 55 unique, and that `LICENSE.upstream`/`UPSTREAM.md` exist **in the
  source tree**, and no `publish.yml`. **It never installs into a target and
  never inspects the footprint.** Lean leaves every one of these true.
- Signed acceptance (`AT-DIST-1`, D24 note) requires the install "exposes all 55
  vendored skills by their Rig names" — satisfied because each `SKILL.md` (with
  rewritten frontmatter) still lands.

**Do not edit any of the five frozen files.** Keep `listVendoredSkills`
returning 55 (it reads source dirs — untouched), `install.sh` shape, and version
`5.0.0`. Then the signed gate stays green with no owner action.

---

## 3. Changes

### 3a. `rig/lib/payload.js` — the core change

Add an install-time file filter so a default install carries markdown only, and
always drops litter.

1. Add a litter predicate (applies in **both** modes):
   ```js
   // Build inputs and working notes never ship: the rendered SKILL.md is the
   // product; .tmpl is its source; TODOS-format.md is a dev file.
   function isLitter(srcAbs) {
     return srcAbs.endsWith('.tmpl') || path.basename(srcAbs) === 'TODOS-format.md';
   }
   ```
2. Give `copyTree` an optional `filter(srcAbs) => boolean`; skip files where it
   returns false. (`copyTree` currently takes `(target, srcAbs, dstRel,
   writeFile, transform)` — add `filter` as the 6th param, default include-all.)
3. Thread `activeDelivery` into `installVendoredSkillsOp` and build its filter:
   ```js
   function installVendoredSkillsOp(target, entry, writeFile, activeDelivery) {
     ...
     const filter = (srcAbs) => {
       if (isLitter(srcAbs)) return false;
       if (activeDelivery) return true;
       return srcAbs.endsWith('.md');   // default install = markdown only
     };
     copyTree(target, src, rel, writeFile, transform, filter);
   }
   ```
   (The `transform` that rewrites the `SKILL.md` frontmatter `name:` is
   unchanged and still applies — `SKILL.md` passes the `.md` filter.)
4. In `runPayload`, pass `activeDelivery` to `installVendoredSkillsOp`:
   ```js
   else if (entry.op === 'install_vendored_skills')
     installVendoredSkillsOp(target, entry, writeFile, activeDelivery);
   ```

### 3b. `rig/manifest.json` — gate the plumbing tree

The plumbing tree is pure code. Add the existing gate to line 56:
```json
{ "op": "copy_tree", "from": "rig/catalog/plumbing", "to": ".rig/plumbing", "host": "neutral", "gate": "active_delivery" }
```
Leave lines 44–46 (`install_vendored_skills`) ungated — 3a handles their
markdown/code split internally. Notice-file copies (lines 48–54) stay ungated
(required by the owner's release condition and referenced by AT-DIST-1).

### 3c. Tests (all unsigned — edit freely)

- **`tests/vendored-skills-install.test.js`**
  - Keep the three `SKILL.md`-exist + frontmatter tests (markdown always lands).
  - "plumbing tree lands regardless of host" (lines 62–70): change to run
    `runPayload(target, ['claude'], { activeDelivery: true })` for plumbing to
    appear; add a companion assertion that **without** `activeDelivery`,
    `.rig/plumbing/bin` does **not** exist.
  - Add: default install (no `activeDelivery`) lands a known code file's absence,
    e.g. `.claude/skills/rig-browse/src/*.ts` is **absent** by default and
    **present** with `activeDelivery: true`.
  - Add: `.tmpl` files and `TODOS-format.md` never land, in either mode.
  - Keep `vendored.length === 55`.
- **`tests/rig-bootstrap.test.js`** (lines 182–209): invert the carve-out. On a
  default install, assert the **entire** `.rig` tree (skills + plumbing) is
  markdown-only — delete the `.rig/plumbing` and per-skill deep-file exemptions.
  Move any non-markdown expectation into a separate `--with-runtime` install
  path/assertion. Keep the notice-file exemptions (LICENSE.upstream is the one
  non-`.md` file allowed).
- **`tests/context-aware-onboarding.test.js`**: verify it makes no non-markdown
  presence assertion; adjust only if it does.

### 3d. `.github/workflows` / distribution test

If the tagged-archive distribution test (see `tests/` for the `dash`/fake-`curl`
install regression) asserts code/plumbing in the installed target, split it: the
default archive install is markdown-only; add a `--with-runtime` case that
asserts the code + plumbing land. (Check before editing; it may only assert
skills + catalogue + runtime, in which case runtime already implies
`--with-runtime`.)

### 3e. Docs + wiki (land on the same branch as the code)

- `CLAUDE.md`: the markdown-only invariant is now true as written — no rewrite
  needed. Optionally add one line: heavy skill runtime + plumbing install only
  under `sh rig/bootstrap.sh --with-runtime`.
- Wiki (per `wiki/reasoning/README.md`): file a dated reasoning trace for the
  lean-install decision; update `topics/install-manifest-removal.md`,
  `topics/distribution-and-release.md`, `topics/the-catalogue.md`,
  `wiki/status.md`, the decision index, and `specs/mvp-roadmap.md` step 3/7.

---

## 4. Slices (each independently verifiable)

1. **Litter first.** Add `isLitter` + `copyTree` filter; drop `.tmpl` +
   `TODOS-format.md` always. Verify: default install lands 0 `.tmpl`; `npm test`
   green. (Small, safe, standalone win.)
2. **Markdown-only skills default.** Add the `activeDelivery` markdown filter to
   `installVendoredSkillsOp`. Verify: default install lands 0 non-`.md` in
   `.rig/skills` / `.claude/skills/rig-*`; `--with-runtime` lands the `.ts` back.
3. **Gate plumbing.** Add `active_delivery` gate to the plumbing `copy_tree`.
   Verify: default install has no `.rig/plumbing`; `--with-runtime` has it.
4. **Tests + docs + wiki** as in 3c–3e. Verify: full `npm test` green with the
   five frozen files byte-unchanged and the owner signature still verifying.

## 5. Verification (final)

```sh
# footprint on a default install — expect zero non-markdown under the payload
sh rig/bootstrap.sh --tier 1 --target /tmp/lean --hosts claude
find /tmp/lean/.claude/skills /tmp/lean/.rig -type f ! -name '*.md' ! -name 'LICENSE.upstream' ! -name 'install-manifest.jsonl' | grep -v '/.rig/preimages/'
#   → (empty)

# with runtime — code + plumbing return
sh rig/bootstrap.sh --tier 1 --target /tmp/full --hosts claude --with-runtime
test -d /tmp/full/.rig/plumbing/bin && echo plumbing-present

npm test   # full gate; frozen oracle unchanged, signature still verifies
```

## 6. Rejected alternatives

- **Gate the whole `install_vendored_skills` op behind `--with-runtime`.**
  Drops all 55 `SKILL.md` from a default install → the shelf disappears and
  AT-DIST-1's "exposes all 55 skills" reading is at risk. Rejected: the
  instructions *are* the product; only the code is runtime.
- **Delete `.tmpl`/`TODOS` from source.** Risk if the build renders `SKILL.md`
  from `.tmpl` at build time. Excluding at install is reversible and safe;
  confirm the build before any source deletion.
- **Re-sign the oracle to encode a footprint cap.** Unnecessary — the footprint
  is not in the signed surface. A cap could be added later as an *unsigned*
  regression (assert default install lands 0 non-markdown) to prevent a future
  swallow from regrowing it.

## 7. Note on the ~3.9 MB markdown

Even lean, the skill *instructions* are ~3.9 MB (`browse`, `make-pdf`, and the
`plan-*` skills carry large docs). Trimming that is a **content** decision, not
this structural change; out of scope here. Flag separately if you want it.
