# Executable Specification Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a specification gate that mechanically rejects every compliance claim this branch currently makes on trust alone, and wire it as the first element of `npm test`.

**Architecture:** A thin CLI (`scripts/check-advanced-spec.js`) over a root-parameterised library (`scripts/lib/spec-gate.js`), so every check can be driven against fixture trees and proven to fail. Checks run in a fixed order and short-circuit. Substantiveness is measured by running each acceptance case's test in isolation under coverage and subtracting the file's module-load baseline: a test that executes no product code fails.

**Tech Stack:** Node 24 (`node:test`, `--experimental-test-coverage`, LCOV + TAP reporters), `ssh-keygen -Y` for signature verification. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-08-17-spec-gate-enforcement-design.md`

## Global Constraints

- Node v24.18.0. `--test-name-pattern`, dual `--test-reporter`, and `--experimental-test-coverage` are all required and all verified present.
- No new npm dependencies. The repo is `private: true` and ships no runtime deps for this work.
- Tier 1 must stay markdown-only in installed repositories. The gate is a **development** control for this repo and lives under `scripts/`, never under `rig/lib/` and never in any install payload.
- The gate takes **no** skip, waiver, exemption, or progress input. Anything resembling one is a plan violation.
- Commits are attributed solely to the repo's git identity. No co-author trailer.
- `npm test` is the push gate. From Task 9 onward it is expected to be **red**; `npm run test:code` becomes the development loop.

### Verified mechanics (do not re-derive)

- Acceptance case IDs are anchored by `^- \*\*(AT-[A-Z0-9-]+)\b` in `acceptance.md`. This yields exactly **52** unique IDs today, no duplicates, and **48** after Task 2.
- LCOV `SF:` paths are **relative to the process cwd**. Run the gate with `cwd = root` and filter hits by the `rig/` prefix.
- **A `--test-name-pattern` that matches nothing still exits 0 and prints `# pass 1`** — the file itself counts as one passing test. TAP summary counts are therefore worthless for proving a test ran. Proof of a real match is a TAP assertion line whose *description contains the case ID*:
  - matched: `ok 1 - AT-REAL-1 exercises product code`
  - no match: `ok 1 - tests/x.test.js` and an inner plan of `1..0`
- Coverage delta separates real from decorative cleanly: baseline 2/8 lines, substantive test 6/8 (delta +4), `assert.equal('AT-FAKE-1','AT-FAKE-1')` 2/8 (delta **0**).

---

### Task 1: Land the repairs already in the working tree

The working tree holds uncommitted fixes for the code-level findings. They must land as their own commit before anything else changes, so the gate work starts from a known-green baseline.

**Files:**
- Modify (already modified, just commit): `rig/lib/apply.js`, `rig/lib/inspect.js`, `rig/lib/catalog.js`, `rig/lib/cli-advanced.js`, `rig/lib/plan.js`, `rig/lib/reports.js`, `rig/lib/host-capabilities.js`, `rig/catalog/baseline/check-copies.js`, and the nine `tests/*.test.js` files
- Delete: `project-dev-docs/current/gate1.allowed-signers`, `project-dev-docs/current/gate1.sig` (already deleted in the working tree)
- Delete: `project-dev-docs/current/reviews/gate2-v0.3-round1-6279bf02.review.json`, `project-dev-docs/current/reviews/gate2-v0.3-round2.review.json`

**Interfaces:**
- Consumes: nothing.
- Produces: a green `npm test` baseline at a known commit.

- [ ] **Step 1: Confirm the baseline is green before touching anything**

Run: `npm test 2>&1 | tail -20`
Expected: `# pass 257`, `# fail 0`, then the pi-extension's `# pass 15`, `# fail 0`.

- [ ] **Step 2: Read the working diff and confirm it is only the known repairs**

Run: `git diff --stat && git status --short`

Expected: the modified files listed above, plus the two deleted `gate1.*` files. If anything else appears, stop and report it rather than committing it.

- [ ] **Step 3: Delete the two void review receipts**

Both bind `target_digest` values (`6279bf02…`, `d8b7ba8d…`) that no longer match the live spec (`86a8a75b…`), and Gate-1 digests that no longer exist. They are superseded artifacts; git history is where those belong.

```bash
git rm project-dev-docs/current/reviews/gate2-v0.3-round1-6279bf02.review.json \
       project-dev-docs/current/reviews/gate2-v0.3-round2.review.json
```

- [ ] **Step 4: Re-run the suite**

Run: `npm test 2>&1 | tail -20`
Expected: still `# fail 0`. Nothing references those receipts yet.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Repair the delivery CLI defects found in review

Verify the plan digest and the catalog/harness digests before applying
instead of checking only that plan_digest is truthy; parse the --approval
flag the spec documents; make remediate apply and roll back rather than
return ok on a digest match; run a real first-enable history scan instead
of logging that one happened; order check-copies' existence guard before
lstat so a missing copy reports rather than throws; and let inspect
survive an in-repo directory symlink.

Remove the Gate 1 trust root re-added by accident, and delete two review
receipts that bind bytes no longer present in the tree."
```

---

### Task 2: Amend the requirements — remove the host tier (52 → 48)

**OWNER GATE.** `acceptance.md` is a frozen intent artifact. `rig/tier-1/routing.md` forbids the implementing context from editing it. This task exists because the intent owner decided to remove the tier; the executor prepares the diff and **must not commit it without the owner approving the exact diff**. If the owner is unavailable, stop here — every later task depends on the 48-case set.

**Files:**
- Modify: `project-dev-docs/current/acceptance.md`

**Interfaces:**
- Consumes: nothing.
- Produces: an acceptance set of exactly 48 IDs; `AT-HOST-3`, `AT-HOST-4`, `AT-CLAIM-2`, `AT-CLAIM-3` no longer exist.

- [ ] **Step 1: Record the pre-amendment digest**

Run: `shasum -a 256 project-dev-docs/current/acceptance.md`
Write the value down; Task 8 needs the *new* one and the contrast is the check.

- [ ] **Step 2: Delete the four tier cases**

Remove the whole bullet for each of `AT-HOST-3`, `AT-HOST-4`, `AT-CLAIM-2`, and `AT-CLAIM-3` from `acceptance.md`. They exist only to draw a verified-versus-unverified distinction the owner has removed.

- [ ] **Step 3: Rewrite `AT-CLAIM-1` to carry uniform treatment**

Replace its body with:

```markdown
- **AT-CLAIM-1 (build the whole roster, treat every host alike) [D1].** *Given*
  onboarding on any host in the roster, *when* Rig installs, *then* every host
  and every CI provider receives its configuration and no code path skips one.
  Rig makes a single uniform statement about all hosts: it installs the
  configuration each host documents, and it does not assert that it has observed
  enforcement firing anywhere. The emitted byte set, the invocation surface, and
  the prompts shown must be identical across hosts; a host that is treated as
  second-class in any observable way fails this case.
```

- [ ] **Step 4: Rewrite `AT-P4` to point at the rewritten case**

Replace its body with:

```markdown
- **AT-P4 uniform host/CI treatment** — see AT-CLAIM-1: Rig builds and emits for
  the whole roster, treats every host identically, and makes one honest claim
  about all of them rather than grading them. Genuine vendor absence degrades
  explicitly and is the only permitted difference.
```

- [ ] **Step 5: Preserve the out-of-repository disclosure that lived in the deleted `AT-CLAIM-2`**

This clause is about writing outside the repo, not about host tiers, and must not be lost as collateral. Append to `AT-HOME-1`'s body:

```markdown
  Every write outside the repository must additionally be named in the install
  output and in every run report, in the user's own output. An undisclosed
  out-of-repository write fails this case.
```

- [ ] **Step 6: Add the revision note at the top of the case list**

```markdown
> **Revision note (2026-08-17) — D20.** The verified/emitted host tier is
> removed. `AT-HOST-3`, `AT-HOST-4`, `AT-CLAIM-2`, and `AT-CLAIM-3` are deleted;
> `AT-CLAIM-1` and `AT-P4` are rewritten to require uniform treatment of all 19
> hosts and 6 providers. The out-of-repository write disclosure formerly in
> `AT-CLAIM-2` moves into `AT-HOME-1`. The intent owner can exercise two hosts
> and the process must never depend on a human testing any host, so a tier whose
> upper grade is unreachable states a promise that cannot be kept. The ID set
> falls from 52 to **48**.
```

- [ ] **Step 7: Verify the count mechanically**

Run:
```bash
node -e 'const t=require("fs").readFileSync("project-dev-docs/current/acceptance.md","utf8");
const ids=t.split("\n").map(l=>/^- \*\*(AT-[A-Z0-9-]+)\b/.exec(l)).filter(Boolean).map(m=>m[1]);
console.log("ids",ids.length,"unique",new Set(ids).size);
console.log("tier cases still present:",["AT-HOST-3","AT-HOST-4","AT-CLAIM-2","AT-CLAIM-3"].filter(d=>ids.includes(d)));'
```
Expected: `ids 48 unique 48` and `tier cases still present: []`.

- [ ] **Step 8: Get owner approval, then commit**

Show the owner `git diff project-dev-docs/current/acceptance.md` and wait for an explicit yes.

```bash
git add project-dev-docs/current/acceptance.md
git commit -m "Remove the verified/emitted host tier from the requirements

The tier's upper grade requires a captured first wire per host axis. The
intent owner can exercise two hosts, and the process must not depend on a
human testing any host, so the upper grade was unreachable for 17 of 19 and
unclaimed for all 19 -- no host has a captured first wire today.

Delete the four cases that exist only to draw the distinction and rewrite
AT-CLAIM-1 and AT-P4 to require uniform treatment instead. Move the
out-of-repository write disclosure into AT-HOME-1 so it survives the
deletion. 52 cases become 48."
```

---

### Task 3: Re-label the host registry

`verified` in the code means "the vendor documents this configuration surface". `verified` in the requirements means "we observed enforcement fire". One spelling, two meanings, and readers assume the stronger one.

**Files:**
- Modify: `rig/lib/host-capabilities.js`
- Modify: `rig/lib/ci-adapters.js`
- Modify: any test asserting the old string (find them in Step 2)

**Interfaces:**
- Consumes: nothing.
- Produces: axis values use `documented`; the constant is `DOCS_CHECKED_ON`. No behavioural change — only the label moves.

- [ ] **Step 1: Find every consumer before renaming**

Run:
```bash
grep -rn "'verified'\|\"verified\"\|VERIFIED_ON" rig/ tests/ scripts/ --include='*.js' | grep -v node_modules
```
Expected: hits in `host-capabilities.js`, `ci-adapters.js`, and their tests. Note every file; all of them change together in Step 3.

- [ ] **Step 2: Run the tests that cover these modules to establish green**

Run: `node --test tests/advanced-hosts.test.js tests/advanced-ci-floor.test.js`
Expected: pass. This is the before-state the rename must preserve.

- [ ] **Step 3: Rename value and constant**

In `rig/lib/host-capabilities.js`: replace the axis value `'verified'` with `'documented'` throughout, and `VERIFIED_ON` with `DOCS_CHECKED_ON`. Replace the header comment's second line with:

```js
// Evidence-gated: an axis is 'documented' when the vendor documents that
// configuration surface, as of DOCS_CHECKED_ON below. Rig does not assert it
// has observed enforcement firing on any host, and makes the same statement
// about all of them (AT-CLAIM-1).
```

In `rig/lib/ci-adapters.js`: replace `status: 'verified'` with `status: 'documented'` and the comparison `provider.status !== 'verified'` with `provider.status !== 'documented'`. Update its header comment to say "Emits only documented adapters." Leave the gating logic itself untouched.

Update every test found in Step 1 to expect the new strings.

- [ ] **Step 4: Verify no stragglers and the behaviour is unchanged**

Run:
```bash
grep -rn "'verified'\|VERIFIED_ON" rig/ tests/ --include='*.js' | grep -v node_modules
node --test tests/advanced-hosts.test.js tests/advanced-ci-floor.test.js
```
Expected: the grep prints nothing; both test files pass exactly as in Step 2.

- [ ] **Step 5: Full suite, then commit**

Run: `npm test 2>&1 | tail -12`
Expected: `# fail 0`.

```bash
git add rig/lib/host-capabilities.js rig/lib/ci-adapters.js tests/
git commit -m "Rename the host registry's verified axis to documented

The registry used 'verified' to mean the vendor documents this config
surface; the requirements use it to mean enforcement was observed firing.
The stronger reading is the one a reader assumes, and it was not true for
any of the 19 hosts -- the evidence field holds a documentation URL and the
string first_wire appears nowhere.

Rename the value and the date constant. No behaviour changes."
```

---

### Task 4: Gate library — case IDs and traceability set equality

First real gate code. TDD, driven against fixture trees so failure paths are provable.

**Files:**
- Create: `scripts/lib/spec-gate.js`
- Create: `tests/advanced-spec-gate.test.js` — the file the traceability table names and which has never existed
- Create: `tests/helpers/spec-gate-fixture.js`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `readCaseIds(root) -> Set<string>`
  - `readTraceRows(root) -> Map<string, {mechanism: string, kind: string, evidence: string}>`
  - `checkTraceability(root) -> string[]` (empty array means pass)
  - Fixture helper: `makeFixture({cases, rows, specExtra}) -> rootPath`

- [ ] **Step 1: Write the fixture helper**

```js
// tests/helpers/spec-gate-fixture.js
'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Builds a throwaway repo tree shaped like this one: acceptance cases, a spec
// with a traceability table, and a tests/ directory.
function makeFixture({ cases = [], rows = [], specExtra = '', testFiles = {} } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-gate-fixture-'));
  fs.mkdirSync(path.join(root, 'project-dev-docs/current/spec'), { recursive: true });
  fs.mkdirSync(path.join(root, 'project-dev-docs/current/reviews'), { recursive: true });
  fs.mkdirSync(path.join(root, 'tests'), { recursive: true });
  fs.mkdirSync(path.join(root, 'rig/lib'), { recursive: true });

  const acceptance = cases.map((id) => `- **${id} (fixture case).** body text\n`).join('');
  fs.writeFileSync(path.join(root, 'project-dev-docs/current/acceptance.md'), `# Fixture\n\n${acceptance}`);
  fs.writeFileSync(path.join(root, 'project-dev-docs/current/spec/business-spec.md'), '# Fixture business spec\n');

  const table = rows
    .map((r) => `| ${r.id} | ${r.mechanism || 'a mechanism'} | ${r.kind || 'behavioral'} | ${r.evidence || ''} |`)
    .join('\n');
  fs.writeFileSync(
    path.join(root, 'project-dev-docs/current/spec/technical-spec.md'),
    `# Fixture spec\n\nrole: gate2-authority\n\n| Case | Design mechanism | Evidence kind | Primary executable evidence |\n|---|---|---|---|\n${table}\n\n${specExtra}\n`
  );

  for (const [name, body] of Object.entries(testFiles)) {
    fs.writeFileSync(path.join(root, 'tests', name), body);
  }
  return root;
}

module.exports = { makeFixture };
```

- [ ] **Step 2: Write the failing tests**

```js
// tests/advanced-spec-gate.test.js
'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { makeFixture } = require('./helpers/spec-gate-fixture.js');
const gate = require('../scripts/lib/spec-gate.js');

test('AT-GATE-1 reads case ids from the acceptance file on disk, never from a written count', () => {
  const root = makeFixture({ cases: ['AT-ONE-1', 'AT-TWO-2'] });
  assert.deepEqual([...gate.readCaseIds(root)].sort(), ['AT-ONE-1', 'AT-TWO-2']);
});

test('AT-GATE-1 rejects an acceptance case with no traceability row', () => {
  const root = makeFixture({
    cases: ['AT-ONE-1', 'AT-TWO-2'],
    rows: [{ id: 'AT-ONE-1' }],
  });
  const errors = gate.checkTraceability(root);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /AT-TWO-2 has no traceability row/);
});

test('AT-GATE-1 rejects a traceability row matching no acceptance case', () => {
  const root = makeFixture({
    cases: ['AT-ONE-1'],
    rows: [{ id: 'AT-ONE-1' }, { id: 'AT-GHOST-9' }],
  });
  const errors = gate.checkTraceability(root);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /AT-GHOST-9 matches no acceptance case/);
});

test('AT-GATE-1 rejects a row declaring an unknown evidence kind', () => {
  const root = makeFixture({
    cases: ['AT-ONE-1'],
    rows: [{ id: 'AT-ONE-1', kind: 'vibes' }],
  });
  const errors = gate.checkTraceability(root);
  assert.match(errors.join('\n'), /unknown evidence kind "vibes"/);
});

test('AT-GATE-1 accepts an exactly equal set', () => {
  const root = makeFixture({
    cases: ['AT-ONE-1', 'AT-TWO-2'],
    rows: [{ id: 'AT-ONE-1' }, { id: 'AT-TWO-2' }],
  });
  assert.deepEqual(gate.checkTraceability(root), []);
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `node --test tests/advanced-spec-gate.test.js`
Expected: FAIL with `Cannot find module '../scripts/lib/spec-gate.js'`.

- [ ] **Step 4: Implement**

```js
// scripts/lib/spec-gate.js
'use strict';
// Development-time specification gate. Governs this repository's own delivery;
// it is not part of the product installed into a user's repository, which is
// why it lives under scripts/ and not rig/lib/.

const fs = require('node:fs');
const path = require('node:path');

const ACCEPTANCE = 'project-dev-docs/current/acceptance.md';
const BUSINESS = 'project-dev-docs/current/spec/business-spec.md';
const SPEC = 'project-dev-docs/current/spec/technical-spec.md';
const EVIDENCE_KINDS = ['behavioral', 'repo-invariant'];

// A case is *defined* by a bullet anchor. Mentions in prose elsewhere in the
// file are cross-references and must not be counted as definitions.
function readCaseIds(root) {
  const text = fs.readFileSync(path.join(root, ACCEPTANCE), 'utf8');
  const ids = new Set();
  for (const line of text.split('\n')) {
    const m = /^- \*\*(AT-[A-Z0-9-]+)\b/.exec(line);
    if (m) ids.add(m[1]);
  }
  return ids;
}

function readTraceRows(root) {
  const text = fs.readFileSync(path.join(root, SPEC), 'utf8');
  const rows = new Map();
  for (const line of text.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length !== 4) continue;
    if (!/^AT-[A-Z0-9-]+$/.test(cells[0])) continue;
    rows.set(cells[0], { mechanism: cells[1], kind: cells[2], evidence: cells[3] });
  }
  return rows;
}

function checkTraceability(root) {
  const ids = readCaseIds(root);
  const rows = readTraceRows(root);
  const errors = [];
  for (const id of ids) if (!rows.has(id)) errors.push(`case ${id} has no traceability row`);
  for (const id of rows.keys()) if (!ids.has(id)) errors.push(`traceability row ${id} matches no acceptance case`);
  for (const [id, row] of rows) {
    if (!ids.has(id)) continue;
    if (!EVIDENCE_KINDS.includes(row.kind)) {
      errors.push(`row ${id} declares unknown evidence kind "${row.kind}"`);
    }
    if (!row.mechanism) errors.push(`row ${id} names no design mechanism`);
  }
  return errors;
}

module.exports = { readCaseIds, readTraceRows, checkTraceability, ACCEPTANCE, BUSINESS, SPEC, EVIDENCE_KINDS };
```

- [ ] **Step 5: Run to verify it passes**

Run: `node --test tests/advanced-spec-gate.test.js`
Expected: `# pass 5`, `# fail 0`.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/spec-gate.js tests/advanced-spec-gate.test.js tests/helpers/spec-gate-fixture.js
git commit -m "Add the specification gate's traceability set-equality check

Read acceptance case ids from the file on disk rather than any written
count, parse the traceability table, and require exact set equality in
both directions. Rows declare an evidence kind so the gate knows whether
to demand executed product code."
```

---

### Task 5: Gate library — target existence and substantiveness by coverage delta

The check that makes everything else non-decorative.

**Files:**
- Modify: `scripts/lib/spec-gate.js`
- Modify: `tests/advanced-spec-gate.test.js`

**Interfaces:**
- Consumes: `readTraceRows`, `checkTraceability` from Task 4.
- Produces:
  - `testFilesFor(row) -> string[]`
  - `checkTargets(root, rows) -> string[]`
  - `parseLcov(text) -> Set<string>` — entries are `"<relative file>:<line>"`
  - `parseTap(text) -> {ok: boolean, name: string}[]`
  - `runFiltered(root, testFile, pattern) -> {lines: Set, assertions: Array, status: number}`
  - `checkSubstantive(root, rows) -> string[]`
  - Constants: `NO_MATCH_SENTINEL`, `MAX_REPO_INVARIANT_ROWS = 4`

- [ ] **Step 1: Write the failing tests**

```js
test('AT-GATE-1 rejects a traceability row naming a test file that does not exist', () => {
  const root = makeFixture({
    cases: ['AT-ONE-1'],
    rows: [{ id: 'AT-ONE-1', evidence: '`ghost.test.js`: does not exist' }],
  });
  const errors = gate.checkTargets(root, gate.readTraceRows(root));
  assert.match(errors.join('\n'), /AT-ONE-1 names ghost\.test\.js, which does not exist/);
});

test('AT-GATE-1 rejects a row naming no executable test file at all', () => {
  const root = makeFixture({
    cases: ['AT-ONE-1'],
    rows: [{ id: 'AT-ONE-1', evidence: 'we will test it somehow' }],
  });
  const errors = gate.checkTargets(root, gate.readTraceRows(root));
  assert.match(errors.join('\n'), /AT-ONE-1 names no executable test file/);
});

test('AT-GATE-1 parses lcov into file:line hits and drops zero-hit lines', () => {
  const hits = gate.parseLcov('SF:rig/lib/a.js\nDA:1,3\nDA:2,0\nend_of_record\n');
  assert.deepEqual([...hits], ['rig/lib/a.js:1']);
});

test('AT-GATE-1 reads tap assertion lines including failures', () => {
  const rows = gate.parseTap('TAP version 13\nok 1 - AT-ONE-1 does a thing\nnot ok 2 - AT-TWO-2 broke\n');
  assert.deepEqual(rows, [
    { ok: true, name: 'AT-ONE-1 does a thing' },
    { ok: false, name: 'AT-TWO-2 broke' },
  ]);
});

test('AT-GATE-1 fails a case whose test executes no product code', () => {
  const root = makeFixture({
    cases: ['AT-FAKE-1'],
    rows: [{ id: 'AT-FAKE-1', evidence: '`fake.test.js`: tautology' }],
    testFiles: {
      'fake.test.js': `const { test } = require('node:test');
const assert = require('node:assert');
require('../rig/lib/prod.js');
test('AT-FAKE-1 tautology', () => { assert.equal('AT-FAKE-1', 'AT-FAKE-1'); });
`,
    },
  });
  require('node:fs').writeFileSync(
    require('node:path').join(root, 'rig/lib/prod.js'),
    "'use strict';\nfunction real(a){ if (a > 1) return 'big'; return 'small'; }\nmodule.exports={real};\n"
  );
  const errors = gate.checkSubstantive(root, gate.readTraceRows(root));
  assert.match(errors.join('\n'), /AT-FAKE-1: matched 1 test\(s\) but executed no product code/);
});

test('AT-GATE-1 passes a case whose test executes product code', () => {
  const root = makeFixture({
    cases: ['AT-REAL-1'],
    rows: [{ id: 'AT-REAL-1', evidence: '`real.test.js`: substantive' }],
    testFiles: {
      'real.test.js': `const { test } = require('node:test');
const assert = require('node:assert');
const prod = require('../rig/lib/prod.js');
test('AT-REAL-1 exercises product code', () => { assert.equal(prod.real(2), 'big'); });
`,
    },
  });
  require('node:fs').writeFileSync(
    require('node:path').join(root, 'rig/lib/prod.js'),
    "'use strict';\nfunction real(a){ if (a > 1) return 'big'; return 'small'; }\nmodule.exports={real};\n"
  );
  assert.deepEqual(gate.checkSubstantive(root, gate.readTraceRows(root)), []);
});

test('AT-GATE-1 fails a case whose named test title does not exist in the file', () => {
  const root = makeFixture({
    cases: ['AT-MISSING-1'],
    rows: [{ id: 'AT-MISSING-1', evidence: '`empty.test.js`: nothing names it' }],
    testFiles: {
      'empty.test.js': `const { test } = require('node:test');
test('something else entirely', () => {});
`,
    },
  });
  const errors = gate.checkSubstantive(root, gate.readTraceRows(root));
  assert.match(errors.join('\n'), /AT-MISSING-1: no test title contains the case id/);
});

test('AT-GATE-1 caps repo-invariant rows so the escape cannot grow silently', () => {
  const ids = ['AT-R-1', 'AT-R-2', 'AT-R-3', 'AT-R-4', 'AT-R-5'];
  const root = makeFixture({
    cases: ids,
    rows: ids.map((id) => ({ id, kind: 'repo-invariant', evidence: '`x.test.js`: a repo fact' })),
    testFiles: { 'x.test.js': "const { test } = require('node:test');\n" },
  });
  const errors = gate.checkSubstantive(root, gate.readTraceRows(root));
  assert.match(errors.join('\n'), /5 rows declare evidence kind repo-invariant, more than the cap of 4/);
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `node --test tests/advanced-spec-gate.test.js`
Expected: FAIL — `gate.checkTargets is not a function`.

- [ ] **Step 3: Implement**

Append to `scripts/lib/spec-gate.js`:

```js
const os = require('node:os');
const { spawnSync } = require('node:child_process');

// A pattern no test title will contain. Running with this yields the file's
// module-load baseline: the lines executed merely by importing it.
const NO_MATCH_SENTINEL = 'RIG_GATE_BASELINE_NO_MATCH_SENTINEL';
const MAX_REPO_INVARIANT_ROWS = 4;
const PRODUCT_PREFIX = 'rig/';
const RUN_TIMEOUT_MS = 10 * 60 * 1000;

function testFilesFor(row) {
  return [...row.evidence.matchAll(/`([\w.-]+\.test\.js)`/g)].map((m) => m[1]);
}

function checkTargets(root, rows) {
  const errors = [];
  for (const [id, row] of rows) {
    const files = testFilesFor(row);
    if (files.length === 0) {
      errors.push(`row ${id} names no executable test file`);
      continue;
    }
    for (const file of files) {
      // node --test on a missing file prints "Could not find" and EXITS 0, so
      // a vanished target would read as green. Stat it instead.
      if (!fs.existsSync(path.join(root, 'tests', file))) {
        errors.push(`row ${id} names ${file}, which does not exist`);
      }
    }
  }
  return errors;
}

function parseLcov(text) {
  const hits = new Set();
  let file = null;
  for (const line of text.split('\n')) {
    if (line.startsWith('SF:')) file = line.slice(3).trim();
    else if (line.startsWith('end_of_record')) file = null;
    else if (line.startsWith('DA:') && file) {
      const [lineNo, count] = line.slice(3).split(',');
      if (Number(count) > 0) hits.add(`${file}:${lineNo}`);
    }
  }
  return hits;
}

function parseTap(text) {
  const out = [];
  for (const line of text.split('\n')) {
    const m = /^\s*(not ok|ok)\s+\d+\s+-\s+(.*?)\s*$/.exec(line);
    if (m) out.push({ ok: m[1] === 'ok', name: m[2] });
  }
  return out;
}

function runFiltered(root, testFile, pattern) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-gate-run-'));
  const cov = path.join(dir, 'cov.info');
  const tap = path.join(dir, 'tap.txt');
  try {
    const run = spawnSync(
      process.execPath,
      [
        '--test',
        '--experimental-test-coverage',
        '--test-reporter=lcov',
        `--test-reporter-destination=${cov}`,
        '--test-reporter=tap',
        `--test-reporter-destination=${tap}`,
        `--test-name-pattern=${pattern}`,
        path.join('tests', testFile),
      ],
      { cwd: root, encoding: 'utf8', timeout: RUN_TIMEOUT_MS }
    );
    return {
      // LCOV SF: paths are relative to cwd, which is why cwd is root.
      lines: fs.existsSync(cov) ? parseLcov(fs.readFileSync(cov, 'utf8')) : new Set(),
      assertions: fs.existsSync(tap) ? parseTap(fs.readFileSync(tap, 'utf8')) : [],
      status: run.status,
    };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function checkSubstantive(root, rows) {
  const errors = [];
  const invariantRows = [...rows.values()].filter((r) => r.kind === 'repo-invariant');
  if (invariantRows.length > MAX_REPO_INVARIANT_ROWS) {
    errors.push(
      `${invariantRows.length} rows declare evidence kind repo-invariant, more than the cap of ${MAX_REPO_INVARIANT_ROWS}`
    );
  }

  const baselines = new Map();
  for (const [id, row] of rows) {
    const matched = [];
    const delta = new Set();
    for (const file of testFilesFor(row)) {
      if (!fs.existsSync(path.join(root, 'tests', file))) continue; // checkTargets reports this
      const run = runFiltered(root, file, id);
      // A pattern matching nothing still exits 0 and reports "# pass 1" for the
      // file itself. Only an assertion line naming the case proves it ran.
      const named = run.assertions.filter((a) => a.name.includes(id));
      matched.push(...named);
      for (const a of named) if (!a.ok) errors.push(`${id}: test "${a.name}" failed`);

      if (row.kind !== 'behavioral') continue;
      if (!baselines.has(file)) baselines.set(file, runFiltered(root, file, NO_MATCH_SENTINEL).lines);
      const base = baselines.get(file);
      for (const hit of run.lines) {
        if (hit.startsWith(PRODUCT_PREFIX) && !base.has(hit)) delta.add(hit);
      }
    }

    if (matched.length === 0) {
      errors.push(`${id}: no test title contains the case id`);
      continue;
    }
    if (row.kind === 'behavioral' && delta.size === 0) {
      errors.push(
        `${id}: matched ${matched.length} test(s) but executed no product code under ${PRODUCT_PREFIX} — decorative`
      );
    }
  }
  return errors;
}
```

Extend the `module.exports` object with `testFilesFor`, `checkTargets`, `parseLcov`, `parseTap`, `runFiltered`, `checkSubstantive`, `NO_MATCH_SENTINEL`, and `MAX_REPO_INVARIANT_ROWS`.

- [ ] **Step 4: Run to verify they pass**

Run: `node --test tests/advanced-spec-gate.test.js`
Expected: `# fail 0`, 13 tests passing.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/spec-gate.js tests/advanced-spec-gate.test.js
git commit -m "Measure acceptance-case substantiveness by coverage delta

Run each case's test in isolation under coverage, subtract the file's
module-load baseline, and require the remainder inside rig/ to be
non-empty. A tautological assertion moves the counter by zero.

A --test-name-pattern matching nothing still exits 0 and reports one
passing test -- the file itself -- so proof that a test ran is a TAP
assertion line naming the case, never a summary count. Stat every named
target too, since node --test on a missing file also exits 0.

Cap repo-invariant rows at four so the one escape from the coverage
requirement cannot grow without showing up as a gate failure."
```

---

### Task 6: Gate library — status, authority, pins, signature, and receipt

**Files:**
- Modify: `scripts/lib/spec-gate.js`
- Modify: `tests/advanced-spec-gate.test.js`

**Interfaces:**
- Consumes: everything from Tasks 4–5.
- Produces:
  - `sha256(file) -> string`
  - `gate1Message(root) -> string`
  - `checkSignature(root) -> {armed: boolean, notes: string[], errors: string[]}`
  - `checkDocument(root) -> string[]` — status, single authority, placeholders
  - `checkPins(root) -> string[]`
  - `checkReceipt(root) -> string[]`
  - `run(root) -> {notes: string[], errors: string[]}`

- [ ] **Step 1: Write the failing tests**

```js
test('AT-GATE-2 reports the intent documents unprotected when no signer identity exists', () => {
  const root = makeFixture({ cases: ['AT-ONE-1'], rows: [{ id: 'AT-ONE-1' }] });
  const result = gate.checkSignature(root);
  assert.equal(result.armed, false);
  assert.deepEqual(result.errors, []);
  assert.match(result.notes.join('\n'), /Gate 1 is unprotected/);
});

test('AT-GATE-2 fails an armed repository whose signature is missing', () => {
  const root = makeFixture({ cases: ['AT-ONE-1'], rows: [{ id: 'AT-ONE-1' }] });
  require('node:fs').writeFileSync(
    require('node:path').join(root, 'project-dev-docs/current/gate1.allowed-signers'),
    'vaibhav namespaces="rig-gate1" ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIfakefakefakefakefakefakefakefakefake\n'
  );
  const result = gate.checkSignature(root);
  assert.equal(result.armed, true);
  assert.match(result.errors.join('\n'), /armed repository has no gate1\.sig/);
});

test('AT-GATE-2 builds the signing message from the live digests', () => {
  const root = makeFixture({ cases: ['AT-ONE-1'], rows: [{ id: 'AT-ONE-1' }] });
  const msg = gate.gate1Message(root);
  assert.match(msg, /^rig-gate1-freeze-v1\nbusiness-spec\.md [0-9a-f]{64}\nacceptance\.md [0-9a-f]{64}\n$/);
});

test('AT-GATE-2 fails a specification still marked candidate', () => {
  const root = makeFixture({ cases: ['AT-ONE-1'], rows: [{ id: 'AT-ONE-1' }], specExtra: '**Status: CANDIDATE.**' });
  assert.match(gate.checkDocument(root).join('\n'), /is not marked FROZEN/);
});

test('AT-GATE-2 fails a specification carrying an unresolved marker', () => {
  const root = makeFixture({
    cases: ['AT-ONE-1'], rows: [{ id: 'AT-ONE-1' }],
    specExtra: '**Status: FROZEN.**\n\nThe merge rule is TBD.',
  });
  assert.match(gate.checkDocument(root).join('\n'), /unresolved marker "TBD"/);
});

test('AT-GATE-2 allows a marker quoted as subject matter rather than standing as one', () => {
  // The real specification defines the filler-rejection rule by naming these
  // tokens, and records that 432 catalogue fragments contain TODO(Slice 10).
  // Quoted in code spans or fenced blocks they are subject matter, not
  // hand-waves, and a gate that cannot tell the difference fails every run.
  const root = makeFixture({
    cases: ['AT-ONE-1'], rows: [{ id: 'AT-ONE-1' }],
    specExtra: '**Status: FROZEN.**\n\nReject `TODO` and `TBD` fragments.\n\n```\nTODO(Slice 10)\n```\n',
  });
  assert.deepEqual(gate.checkDocument(root), []);
});

test('AT-GATE-2 fails when a second document claims specification authority', () => {
  const root = makeFixture({ cases: ['AT-ONE-1'], rows: [{ id: 'AT-ONE-1' }], specExtra: '**Status: FROZEN.**' });
  require('node:fs').writeFileSync(
    require('node:path').join(root, 'project-dev-docs/current/spec/rival.md'),
    'role: gate2-authority\n'
  );
  assert.match(gate.checkDocument(root).join('\n'), /second document claims specification authority: rival\.md/);
});

test('AT-GATE-2 fails when the recorded pins do not equal the live digests', () => {
  const root = makeFixture({
    cases: ['AT-ONE-1'], rows: [{ id: 'AT-ONE-1' }],
    specExtra: '| `business-spec.md` | `' + '0'.repeat(64) + '` |\n| `acceptance.md` | `' + '1'.repeat(64) + '` |',
  });
  assert.match(gate.checkPins(root).join('\n'), /pin for business-spec\.md is stale/);
});

test('AT-GATE-3 rejects a receipt bound to a digest that is not the live one', () => {
  const root = makeFixture({ cases: ['AT-ONE-1'], rows: [{ id: 'AT-ONE-1' }] });
  writeReceipt(root, { reviewed: { 'project-dev-docs/current/acceptance.md': '0'.repeat(64) } });
  assert.match(gate.checkReceipt(root).join('\n'), /reviewed digest for .*acceptance\.md does not match/);
});

test('AT-GATE-3 rejects a receipt missing a verdict for a case', () => {
  const root = makeFixture({ cases: ['AT-ONE-1', 'AT-TWO-2'], rows: [{ id: 'AT-ONE-1' }, { id: 'AT-TWO-2' }] });
  writeReceipt(root, { cases: [{ id: 'AT-ONE-1', verdict: 'pass', testable: true, conflicts: [] }] });
  assert.match(gate.checkReceipt(root).join('\n'), /receipt has no verdict for AT-TWO-2/);
});

test('AT-GATE-3 rejects a receipt reviewed by the authoring model', () => {
  const root = makeFixture({ cases: ['AT-ONE-1'], rows: [{ id: 'AT-ONE-1' }] });
  writeReceipt(root, { reviewer_model: 'model-a', authoring_model: 'model-a' });
  assert.match(gate.checkReceipt(root).join('\n'), /reviewed by the authoring model/);
});
```

Add this helper at the top of the test file, below the imports — it writes a receipt whose fields default to valid so each test varies exactly one thing:

```js
const fs = require('node:fs');
const path = require('node:path');

function writeReceipt(root, overrides = {}) {
  const live = (rel) => gate.sha256(path.join(root, rel));
  const ids = [...gate.readCaseIds(root)];
  const receipt = {
    schema: 'rig-spec-review/v1',
    reviewed: {
      'project-dev-docs/current/spec/technical-spec.md': live('project-dev-docs/current/spec/technical-spec.md'),
      'project-dev-docs/current/spec/business-spec.md': live('project-dev-docs/current/spec/business-spec.md'),
      'project-dev-docs/current/acceptance.md': live('project-dev-docs/current/acceptance.md'),
      ...(overrides.reviewed || {}),
    },
    authoring_model: overrides.authoring_model || 'model-author',
    reviewer_model: overrides.reviewer_model || 'model-reviewer',
    reviewed_at: '2026-08-17T00:00:00.000Z',
    run_id: 'fixture-run',
    cases: overrides.cases || ids.map((id) => ({ id, testable: true, conflicts: [], verdict: 'pass' })),
    unresolved: overrides.unresolved || [],
  };
  fs.writeFileSync(
    path.join(root, 'project-dev-docs/current/reviews/current.review.json'),
    `${JSON.stringify(receipt, null, 2)}\n`
  );
  return receipt;
}
```

- [ ] **Step 2: Run to verify they fail**

Run: `node --test tests/advanced-spec-gate.test.js`
Expected: FAIL — `gate.checkSignature is not a function`.

- [ ] **Step 3: Implement**

Append to `scripts/lib/spec-gate.js`:

```js
const { createHash } = require('node:crypto');

const SIGNERS = 'project-dev-docs/current/gate1.allowed-signers';
const SIGNATURE = 'project-dev-docs/current/gate1.sig';
const REVIEWS = 'project-dev-docs/current/reviews';
const NAMESPACE = 'rig-gate1';
const MARKERS = ['TODO', 'TBD', 'FIXME', 'XXX', '???'];

function sha256(file) {
  return createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function gate1Message(root) {
  const business = sha256(path.join(root, BUSINESS));
  const acceptance = sha256(path.join(root, ACCEPTANCE));
  return `rig-gate1-freeze-v1\nbusiness-spec.md ${business}\nacceptance.md ${acceptance}\n`;
}

// Presence of the signer identity arms the check. Armed, a missing, malformed,
// or non-verifying signature fails. Unarmed, the gate says so and continues, so
// a stranger who cloned the repository can still run the suite.
function checkSignature(root) {
  const signers = path.join(root, SIGNERS);
  const notes = [];
  if (!fs.existsSync(signers)) {
    notes.push('Gate 1 is unprotected: no signer identity file is present.');
    return { armed: false, notes, errors: [] };
  }
  const sig = path.join(root, SIGNATURE);
  if (!fs.existsSync(sig)) return { armed: true, notes, errors: ['armed repository has no gate1.sig'] };

  const found = spawnSync('ssh-keygen', ['-Y', 'find-principals', '-s', sig, '-f', signers], { encoding: 'utf8' });
  const principal = (found.stdout || '').split('\n').map((s) => s.trim()).filter(Boolean)[0];
  if (!principal) {
    return { armed: true, notes, errors: ['no principal in gate1.allowed-signers matches gate1.sig'] };
  }
  const verify = spawnSync(
    'ssh-keygen',
    ['-Y', 'verify', '-f', signers, '-I', principal, '-n', NAMESPACE, '-s', sig],
    { input: gate1Message(root), encoding: 'utf8' }
  );
  if (verify.status !== 0) {
    return {
      armed: true,
      notes,
      errors: [`gate1.sig does not verify against the live digests: ${(verify.stderr || '').trim()}`],
    };
  }
  // Name what was verified against, so a replaced trust root shows up in
  // ordinary output rather than only in a diff.
  const keyLine = fs.readFileSync(signers, 'utf8').split('\n').find((l) => l.startsWith(`${principal} `)) || '';
  const keyParts = keyLine.trim().split(/\s+/).slice(-2).join(' ');
  const fp = spawnSync('ssh-keygen', ['-lf', '-'], { input: `${keyParts}\n`, encoding: 'utf8' });
  notes.push(`Gate 1 signature verified for principal "${principal}" against ${(fp.stdout || 'unknown key').trim()}`);
  return { armed: true, notes, errors: [] };
}

// A marker is a placeholder only where it stands as one. This specification
// legitimately *names* these tokens: it defines the filler-rejection rule
// around them and records that 432 catalogue fragments contain TODO(Slice 10).
// Quoted in a code span or a fenced block a marker is subject matter, so strip
// both before scanning; a gate that cannot tell the difference fails every run.
function proseOnly(text) {
  return text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

function checkDocument(root) {
  const specPath = path.join(root, SPEC);
  const text = fs.readFileSync(specPath, 'utf8');
  const prose = proseOnly(text);
  const errors = [];
  if (!/\*\*Status:\s*FROZEN/.test(text)) errors.push(`${SPEC} is not marked FROZEN`);
  for (const marker of MARKERS) {
    const pattern = marker === '???' ? /\?\?\?/ : new RegExp(`\\b${marker}\\b`);
    if (pattern.test(prose)) errors.push(`${SPEC} carries unresolved marker "${marker}"`);
  }
  const specDir = path.dirname(specPath);
  for (const entry of fs.readdirSync(specDir)) {
    if (entry === path.basename(SPEC)) continue;
    if (!entry.endsWith('.md')) continue;
    if (fs.readFileSync(path.join(specDir, entry), 'utf8').includes('role: gate2-authority')) {
      errors.push(`a second document claims specification authority: ${entry}`);
    }
  }
  return errors;
}

function checkPins(root) {
  const text = fs.readFileSync(path.join(root, SPEC), 'utf8');
  const pins = {};
  for (const m of text.matchAll(/^\|\s*`(business-spec\.md|acceptance\.md)`\s*\|\s*`([0-9a-f]{64})`\s*\|/gm)) {
    pins[m[1]] = m[2];
  }
  const live = {
    'business-spec.md': sha256(path.join(root, BUSINESS)),
    'acceptance.md': sha256(path.join(root, ACCEPTANCE)),
  };
  const errors = [];
  for (const [name, digest] of Object.entries(live)) {
    if (!pins[name]) errors.push(`${SPEC} records no pin for ${name}`);
    else if (pins[name] !== digest) {
      errors.push(`pin for ${name} is stale: recorded ${pins[name].slice(0, 12)}, live ${digest.slice(0, 12)}`);
    }
  }
  return errors;
}

function checkReceipt(root) {
  const dir = path.join(root, REVIEWS);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')) : [];
  if (files.length === 0) return ['no specification review receipt is present'];
  if (files.length > 1) return [`expected exactly one review receipt, found ${files.length}: ${files.join(', ')}`];

  const receipt = JSON.parse(fs.readFileSync(path.join(dir, files[0]), 'utf8'));
  const errors = [];
  if (receipt.schema !== 'rig-spec-review/v1') errors.push(`receipt schema is ${receipt.schema}, expected rig-spec-review/v1`);

  for (const rel of [SPEC, BUSINESS, ACCEPTANCE]) {
    const live = sha256(path.join(root, rel));
    if ((receipt.reviewed || {})[rel] !== live) {
      errors.push(`reviewed digest for ${rel} does not match the live file`);
    }
  }

  const ids = readCaseIds(root);
  const byId = new Map((receipt.cases || []).map((c) => [c.id, c]));
  for (const id of ids) {
    const entry = byId.get(id);
    if (!entry) errors.push(`receipt has no verdict for ${id}`);
    else if (entry.verdict !== 'pass') errors.push(`receipt verdict for ${id} is ${entry.verdict}`);
  }
  for (const id of byId.keys()) if (!ids.has(id)) errors.push(`receipt carries a verdict for unknown case ${id}`);

  if ((receipt.unresolved || []).length) errors.push(`receipt leaves ${receipt.unresolved.length} case(s) unresolved`);
  if (receipt.reviewer_model && receipt.reviewer_model === receipt.authoring_model) {
    errors.push(`receipt was reviewed by the authoring model ${receipt.reviewer_model}`);
  }
  return errors;
}

// Ordered, short-circuiting. Nothing later is meaningful if Gate 1 has moved,
// and the substantiveness pass is the expensive one, so it runs last.
function run(root) {
  const notes = [];
  const sig = checkSignature(root);
  notes.push(...sig.notes);
  if (sig.errors.length) return { notes, errors: sig.errors };

  const doc = [...checkDocument(root), ...checkPins(root)];
  if (doc.length) return { notes, errors: doc };

  const trace = checkTraceability(root);
  if (trace.length) return { notes, errors: trace };

  const rows = readTraceRows(root);
  const targets = checkTargets(root, rows);
  if (targets.length) return { notes, errors: targets };

  const receipt = checkReceipt(root);
  if (receipt.length) return { notes, errors: receipt };

  return { notes, errors: checkSubstantive(root, rows) };
}
```

Extend `module.exports` with `sha256`, `gate1Message`, `checkSignature`, `checkDocument`, `checkPins`, `checkReceipt`, and `run`.

- [ ] **Step 4: Run to verify they pass**

Run: `node --test tests/advanced-spec-gate.test.js`
Expected: `# fail 0`, 24 tests passing.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/spec-gate.js tests/advanced-spec-gate.test.js
git commit -m "Add the gate's signature, document, pin, and receipt checks

Verify the intent signature first, since nothing later means anything if
the intent documents moved; report them unprotected and continue when no
signer identity is present, so a fresh clone can still run the suite.
Require a frozen status, a single authority document, no unresolved
markers, pins equal to the live digests, and a receipt bound to those
digests carrying one passing verdict per case from a non-authoring model."
```

---

### Task 7: Review wrapper emits a verdict per case

`scripts/review-receipt.js` already writes the model, digest and timestamp itself and refuses a same-model review. What it cannot express is a verdict per case, which is what the requirements ask for.

**Files:**
- Modify: `scripts/review-receipt.js`

**Interfaces:**
- Consumes: `readCaseIds` from `scripts/lib/spec-gate.js`.
- Produces: receipts in `rig-spec-review/v1` shape, which `checkReceipt` from Task 6 already validates.

- [ ] **Step 1: Require the gate library and read the case list**

After the existing `gate1` assembly, add:

```js
const { readCaseIds } = require('./lib/spec-gate.js');
const repoRoot = require('node:path').resolve(__dirname, '..');
const caseIds = [...readCaseIds(repoRoot)];
```

- [ ] **Step 2: Replace the reply shape in the prompt**

Replace the fenced JSON shape in the prompt with:

```js
`\`\`\`json
{
  "cases": [
    {
      "id": "<one of the ${caseIds.length} ids listed below>",
      "testable": true,
      "conflicts": ["<clause pair that prescribes incompatible outcomes>"],
      "verdict": "pass" | "fail",
      "note": "<why, quoting the offending text when it fails>"
    }
  ],
  "unresolved": ["<case id with no adequate contract>"]
}
\`\`\`

You MUST return exactly one entry per id, for all ${caseIds.length} ids, and no
others. A case is "pass" only if it has one testable implementation contract in
Gate 2 and no clause contradicting it. These are the ids:

${caseIds.join(', ')}
`
```

- [ ] **Step 3: Validate the reviewer covered every case before writing**

After `reported` is parsed, add:

```js
const returned = new Set((reported.cases || []).map((c) => c.id));
const missing = caseIds.filter((id) => !returned.has(id));
const extra = [...returned].filter((id) => !caseIds.includes(id));
if (missing.length) fail(`reviewer omitted ${missing.length} case(s): ${missing.join(', ')}`);
if (extra.length) fail(`reviewer invented unknown case(s): ${extra.join(', ')}`);
```

- [ ] **Step 4: Write the new receipt shape**

Replace the `writeFileSync` payload with:

```js
{
  schema: 'rig-spec-review/v1',
  wrapper_version: WRAPPER_VERSION,
  reviewed: {
    [targetPath]: targetDigest,
    ...Object.fromEntries(gate1.map((g) => [g.path, g.digest])),
  },
  authoring_model: authoring ? authoring[1] : null,
  reviewer_model: model,
  reviewed_at: new Date().toISOString(),
  run_id: `${process.pid}-${Date.now()}`,
  cases: reported.cases,
  unresolved: reported.unresolved || [],
}
```

Update the closing `console.log` to report `reported.cases.filter((c) => c.verdict !== 'pass').length` failing cases instead of blocker counts.

- [ ] **Step 5: Verify the wrapper still refuses a same-model review**

Run:
```bash
node scripts/review-receipt.js --target project-dev-docs/current/spec/technical-spec.md \
  --model claude-opus-5 --out /tmp/should-not-exist.json
```
Expected: exits 1 with `refusing same-model review`, and `/tmp/should-not-exist.json` is not created. This runs no reviewer, so it costs nothing.

- [ ] **Step 6: Commit**

```bash
git add scripts/review-receipt.js
git commit -m "Make review receipts carry one verdict per acceptance case

The receipt had a single global verdict and flat arrays, which cannot
express the per-case judgement the requirements ask for. Read the case
ids from the acceptance file, require the reviewer to return exactly one
entry per id, and refuse to write a receipt that omits or invents one.
The model, digests, timestamp and run id stay wrapper-written."
```

---

### Task 8: Rewrite the traceability table against the 48 cases

The gate now exists and can judge this work, so the table is rewritten with the gate available to check it.

**Files:**
- Modify: `project-dev-docs/current/spec/technical-spec.md`

**Interfaces:**
- Consumes: `checkTraceability`, `checkTargets` from Tasks 4–5.
- Produces: a four-column table whose row set equals the 48 case ids.

- [ ] **Step 1: Add the authority declaration**

Add `role: gate2-authority` as its own line in the document header. `checkDocument` requires exactly one document under `project-dev-docs/current/spec/` to carry it.

- [ ] **Step 2: Quote the three prose marker mentions**

`checkDocument` strips code spans and fenced blocks before scanning, so a marker
named as subject matter is fine — but three sites say `TODO` in bare prose and
would fail the gate on every run. Verified: exactly these three, all the same
phrase, and `TBD` is already fully quoted.

- `technical-spec.md:2008` — in the `AT-SHAPE-6` row, `Reject TODO/generic/repeated content`
- `technical-spec.md:2315` — `Replace every TODO/generic/repeated fragment`
- `technical-spec.md:2524` — `all 115 leaves replace TODO/generic/repeated content`

Change `TODO` to `` `TODO` `` at each. Then confirm:

```bash
node -e 'const t=require("fs").readFileSync("project-dev-docs/current/spec/technical-spec.md","utf8");
const prose=t.replace(/```[\s\S]*?```/g,"").replace(/`[^`\n]*`/g,"");
console.log("bare markers left:",["TODO","TBD","FIXME","XXX"].map(m=>[m,(prose.match(new RegExp("\\b"+m+"\\b","g"))||[]).length]));'
```
Expected: every count `0`.

- [ ] **Step 3: Convert the table to four columns**

Change the header to:

```markdown
| Gate 1 case | Design mechanism | Evidence kind | Primary executable evidence |
|---|---|---|---|
```

Every existing row gains an `Evidence kind` cell of `behavioral`, except the rows that assert repository facts rather than product behaviour. At most **four** rows may be `repo-invariant` — the gate hard-fails at five. Choose them from the cases that genuinely execute no product code, and no others.

- [ ] **Step 4: Delete the four rows for the removed cases**

Remove the rows for `AT-HOST-3`, `AT-HOST-4`, `AT-CLAIM-2`, and `AT-CLAIM-3`, and rewrite the `AT-CLAIM-1` and `AT-P4` rows to describe uniform treatment.

- [ ] **Step 5: Point every row at a test file that exists**

Each row's evidence cell must name at least one file as `` `name.test.js` `` and that file must exist under `tests/`. For a case with no test yet, name the file it will live in and **create that file** with the tests that case needs — this is the burn-down, and it is the subject of the follow-on plans, not this one. For this task, only rows whose tests already exist may be marked complete; the rest are expected to fail Task 9's first run.

- [ ] **Step 6: Re-pin the header digests**

The acceptance file changed in Task 2, so the recorded pins are stale.

Run:
```bash
shasum -a 256 project-dev-docs/current/spec/business-spec.md project-dev-docs/current/acceptance.md
```
Copy both values into the header pin table.

- [ ] **Step 7: Check the table with the gate's own parser**

Run:
```bash
node -e 'const g=require("./scripts/lib/spec-gate.js");const r=process.cwd();
const t=g.checkTraceability(r); console.log("traceability:",t.length?t:"ok");
console.log("pins:",g.checkPins(r).length?g.checkPins(r):"ok");
const tg=g.checkTargets(r,g.readTraceRows(r)); console.log("targets:",tg.length?tg:"ok");'
```
Expected: `traceability: ok` and `pins: ok`. `targets` will list every row naming a test file that does not exist yet — that list is the burn-down backlog and should be captured for the follow-on plans.

- [ ] **Step 8: Commit**

```bash
git add project-dev-docs/current/spec/technical-spec.md
git commit -m "Rewrite the traceability table against the 48-case set

Drop the four rows for the deleted host-tier cases, rewrite AT-CLAIM-1
and AT-P4 for uniform treatment, and add an evidence-kind column so the
gate knows which rows must execute product code. Re-pin the header
digests, which the acceptance amendment made stale, and declare this
document the single specification authority."
```

---

### Task 9: Wire the gate into `npm test`

**The suite goes red at this task and stays red until the burn-down is finished.** That is the specified behaviour, chosen deliberately.

**Files:**
- Create: `scripts/check-advanced-spec.js`
- Modify: `package.json`
- Modify: `CLAUDE.md`
- Modify: `docs/advanced/dev-ci-red-status.md`

**Interfaces:**
- Consumes: `run(root)` from Task 6.
- Produces: `npm test` gated; `npm run test:code` as the development loop.

- [ ] **Step 1: Write the CLI entry**

```js
#!/usr/bin/env node
'use strict';
// First element of `npm test`. Short-circuits every code test on failure:
// a code-correctness result may not promote a build whose specification is
// unfrozen, unreviewed, or untraceable.

const path = require('node:path');
const gate = require('./lib/spec-gate.js');

const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..');
const { notes, errors } = gate.run(root);

for (const note of notes) console.log(`specification gate: ${note}`);

if (errors.length) {
  console.error(`\nspecification gate FAILED (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log('specification gate PASSED');
```

- [ ] **Step 2: Run it against the live repository**

Run: `node scripts/check-advanced-spec.js`
Expected: FAIL, listing every case whose test does not yet exist or does not execute product code. Capture this output — it is the burn-down backlog.

- [ ] **Step 3: Wire it first into `npm test` and add the development loop**

In `package.json`, replace the `test` script and add `test:code`:

```json
"test": "node scripts/check-advanced-spec.js && npm run test:code",
"test:code": "npm run test:secrets && node scripts/check-rule-copies.js && node scripts/check-versions.js && PATH=.venv/bin:$PATH node --test tests/*.test.js && npm test --prefix pi-extension",
```

The `&&` is what makes a failing gate short-circuit the code tests so they do not execute at all. `test:code` is the daily signal, matching the cadence decision already recorded in the handoff.

- [ ] **Step 4: Prove the short-circuit is real**

Run: `npm test 2>&1 | head -30`
Expected: the gate's failure list, and **no** test output after it — `test:secrets` must not run.

Run: `npm run test:code 2>&1 | tail -12`
Expected: `# fail 0`. The code tests are still green; only the specification gate is red.

- [ ] **Step 5: Update `CLAUDE.md` so a future session does not read red as a defect**

Replace the Checks section's command block and add a sentence after it:

```markdown
```sh
npm test          # full CI gate: specification gate first, then code — must pass before push
npm run test:code # the development loop while the specification gate is red
npm run test:rig  # fast bootstrap-only subset
```

From the landing of `scripts/check-advanced-spec.js` until the acceptance
burn-down is complete, `npm test` is **expected to fail** at the specification
gate: cases without a substantive test are exactly what it reports. This is the
gate working, not a defect to route around. Use `npm run test:code` while
working; `npm test` must still be green before any push, which is why nothing
is pushed until the burn-down finishes.
```

- [ ] **Step 6: Replace the CI status note**

Overwrite `docs/advanced/dev-ci-red-status.md`:

```markdown
# Dev CI status

- `npm test` runs the specification gate first and short-circuits the code
  tests on failure. `npm run test:code` runs the code tests alone.
- `.github/workflows/test.yml` invokes `npm test` (full gate). No second
  workflow was added.
- **Current expected status: RED, deliberately.** The specification gate
  reports every acceptance case that has no substantive executable test. That
  set is non-empty until the burn-down completes, and the redness is the gate
  reporting real missing coverage rather than a defect in the suite.
- The code tests themselves are expected GREEN throughout. If `npm run
  test:code` fails, that is a defect.
```

- [ ] **Step 7: Commit**

```bash
git add scripts/check-advanced-spec.js package.json CLAUDE.md docs/advanced/dev-ci-red-status.md
git commit -m "Run the specification gate first in npm test

Wire the gate ahead of every code test, joined with && so a failure
short-circuits them and no code-correctness result can promote a build
whose specification is unfrozen, unreviewed, or untraceable. Add
npm run test:code as the development loop.

The suite is red from this commit until every acceptance case has a
substantive test. That is the gate reporting real missing coverage.
Record it in CLAUDE.md and the CI status note so it is not mistaken for
a defect and routed around."
```

---

### Task 10: Freeze the specification

Runs only once Tasks 1–9 are green **except** for the substantiveness failures, which the burn-down plans clear.

**Files:**
- Modify: `project-dev-docs/current/spec/technical-spec.md` (status line)
- Create: `project-dev-docs/current/reviews/current.review.json`
- Create (owner only): `project-dev-docs/current/gate1.allowed-signers`, `project-dev-docs/current/gate1.sig`

**Interfaces:**
- Consumes: the Task 7 wrapper; `checkReceipt` from Task 6.
- Produces: a frozen, reviewed, optionally armed specification.

- [ ] **Step 1: Run the fresh-model review**

The spec declares `claude-opus-5` as its authoring model, so the reviewer must be a different one. It takes several minutes.

```bash
node scripts/review-receipt.js \
  --target project-dev-docs/current/spec/technical-spec.md \
  --gate1 project-dev-docs/current/spec/business-spec.md,project-dev-docs/current/acceptance.md \
  --model claude-sonnet-5 \
  --out project-dev-docs/current/reviews/current.review.json
```

- [ ] **Step 2: Act on the findings**

If any case has a verdict other than `pass` or `unresolved` is non-empty, fix the specification and re-run Step 1. The receipt binds digests, so editing the spec voids the receipt by construction — that is the mechanism working.

- [ ] **Step 3: Mark the specification frozen**

Replace the header status block with:

```markdown
> **Status: FROZEN 2026-08-17.** Reviewed at the digest recorded in
> `reviews/current.review.json`, one verdict per acceptance case, under a model
> other than the authoring one. Any edit to this file or to either intent
> document voids that receipt and fails the specification gate.
```

- [ ] **Step 4: Verify the document checks pass**

Run:
```bash
node -e 'const g=require("./scripts/lib/spec-gate.js");const r=process.cwd();
console.log("document:",g.checkDocument(r).length?g.checkDocument(r):"ok");
console.log("receipt:",g.checkReceipt(r).length?g.checkReceipt(r):"ok");'
```
Expected: both `ok`.

- [ ] **Step 5 (INTENT OWNER ONLY — an agent must not perform this): arm the signature**

This is optional and can be deferred; the gate reports the intent documents unprotected and continues without it. If the owner chooses to arm it, they run this themselves, on its own, never bundled into other work — bundling is how a test key got committed twice.

```sh
printf 'rig-gate1-freeze-v1\nbusiness-spec.md %s\nacceptance.md %s\n' \
  "$(shasum -a 256 project-dev-docs/current/spec/business-spec.md | cut -d' ' -f1)" \
  "$(shasum -a 256 project-dev-docs/current/acceptance.md         | cut -d' ' -f1)" \
  > /tmp/gate1.msg

ssh-keygen -Y sign -f <private-key> -n rig-gate1 /tmp/gate1.msg
mv /tmp/gate1.msg.sig project-dev-docs/current/gate1.sig

PUBKEY=<public-key>.pub
PRINCIPAL=vaibhav
{
  printf '# key class attested by the intent owner: <class>\n'
  printf '%s namespaces="rig-gate1" %s\n' "$PRINCIPAL" "$(awk '{print $1" "$2}' "$PUBKEY")"
} > project-dev-docs/current/gate1.allowed-signers
```

Then confirm the gate reports the principal and fingerprint:

Run: `node scripts/check-advanced-spec.js 2>&1 | head -3`
Expected: `specification gate: Gate 1 signature verified for principal "vaibhav" against …`

- [ ] **Step 6: Commit**

```bash
git add project-dev-docs/current/spec/technical-spec.md project-dev-docs/current/reviews/current.review.json
git commit -m "Freeze the technical specification against the 48-case set

Reviewed in a fresh session under a model other than the authoring one,
with one verdict per acceptance case, bound to the live digests. Any
later edit to this file or to either intent document voids the receipt
and fails the specification gate."
```

---

## Follow-on plans (not in scope here)

The gate is complete after Task 10, and reports the truth: most acceptance cases have no substantive test. Clearing that is separate work, and it splits into plans that can each produce working software on their own:

1. **Cases needing no new product** — the ordering and authority cases, the authored-catalogue and honest-disposition cases, the rewritten roster case, the host contract and evaluator cases, the MCP retirement case, the four baseline control cases, the self-activation case, the secret-handling and reporting cases, the remediation and testing-scope cases, and the presence case. Also replaces the two decorative alias tests with ones that invoke the real scenarios.
2. **The install journal** — append-only, ordered `seq`, record-before-mutate, `install_id`, resume, and the incomplete-install header that suppresses every protection claim.
3. **The uninstall rewrite** — content-addressed preimage store, reverse-order removal, managed-block stripping, verified-clean versus best-effort. Today's `rig/lib/uninstall.js` walks a hard-coded path list from a receipt and does none of this.
4. **The user-global write ledger** — attribution by `install_id` across repositories.
5. **The CI providers** — the five not yet built, plus first-run receipts.
6. **The install stub** — standalone fetch-a-release-tag stub and its container test.

Plan 2 must precede 3; the rest are independent.

## Self-review

**Spec coverage.** Design §3 (gate check order) → Tasks 4, 5, 6, 9. §4 (coverage delta, repo-invariant cap) → Task 5. §5 (receipt shape) → Tasks 6, 7. §6 (requirements amendment) → Task 2. §7 (registry re-labelling) → Task 3. §8 Phase 0 → Task 1; Phase 2 → Task 8; Phase 3 → Task 9; Phase 4 → Task 10; Phases 5–6 → the follow-on plans above, deliberately out of scope. §9 non-goals are respected: no mutation testing, no per-host claim, and arming stays the owner's optional act.

**Placeholders.** The `<private-key>`, `<public-key>` and `<class>` tokens in Task 10 Step 5 are the intent owner's own secrets and must not be filled in by an agent; every other step carries literal content.

**Fixed during self-review.** The placeholder scan was first written as `text.includes(marker)`, which would have failed the gate on every single run: the specification legitimately names `TODO` and `TBD` because it *defines* the filler-rejection rule around them, and records that 432 catalogue fragments contain `TODO(Slice 10)`. Checked against the real file — 7 `TODO` and 1 `TBD` occurrences. `checkDocument` now strips fenced blocks and code spans before scanning and matches on word boundaries, Task 6 gained a test proving a quoted marker is allowed, and Task 8 Step 2 quotes the three bare-prose sites (verified to be exactly three, all the same phrase). This is the same class of defect the gate exists to catch, which is why it is recorded rather than silently corrected.

**Type consistency.** `readCaseIds` returns a `Set` and is consumed as one in `checkReceipt` (`ids.has`) and spread to an array in Task 7. `readTraceRows` returns a `Map` consumed by `checkTargets`, `checkSubstantive` and `run`. `parseLcov` returns a `Set` of `"file:line"` strings, compared against baselines of the same shape. `checkSignature` returns `{armed, notes, errors}` while every other check returns a bare `string[]`; `run` handles that difference explicitly.
