# Wiki Budget Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put a machine oracle in `npm test` that measures the wiki's read cost, enumerates every current violation as a shrinking waiver list, and gives agents a bounded query so they stop browsing hubs.

**Architecture:** One pure measurement module (`scripts/wiki-budget.js`) reusing the frontmatter parser that already exists in `scripts/build-wiki-index.js`, one policy CLI on top of it (`scripts/check-wiki-budget.js`) that applies a ratchet-only waiver file, and one bounded retrieval CLI (`scripts/wiki-query.js`) over the same parser. The gate enters CI through a new `tests/wiki-budget.test.js` picked up by the existing `tests/*.test.js` glob — **not** through `package.json`, which is a signed Gate 1 oracle surface.

**Tech Stack:** Node 22, CommonJS, `node:` built-ins only, `node --test`. No new dependencies. Config and waivers are plain JSON in `wiki/`.

**Spec:** `.context/attachments/fD2R8F/Transcript of Token Burn Roadmap.md` § "The scoped work order" (D3 answer B), grounded in `wiki/reasoning/2026-09-05-overhaul-scope-measurements.md` and `wiki/reasoning/2026-09-04-structural-workflow-fix-design.md`.

---

## Global Constraints

Every task's requirements implicitly include this section.

- **Never edit `package.json`'s `scripts` object.** `scripts/check-advanced-spec.js` does a byte-exact `assert.deepEqual` against the signed snapshot `wiki/gate1/package-scripts.json`. Editing it makes `npm test` red and needs the intent owner's hardware key to re-sign. This exact mistake was made and reverted on 2026-09-04 (`wiki/reasoning/2026-09-04-gate1-package-scripts-break-and-revert.md`). New checks enter the gate as a new `tests/<name>.test.js` file, which the existing `tests/*.test.js` glob picks up for free. `scripts/wiki-maintenance.js:157-163` documents this as the accepted shape.
- **Never edit anything under `wiki/gate1/` or `wiki/gate2/`.** Gate 1 is signed; Gate 2 is a gate document.
- **A reasoning-trace body is immutable.** Only frontmatter may change after filing (`wiki/reasoning/README.md`). Filling in a missing `summary:` field is legal and required by this plan. Rewriting a trace body, or synthesising a `topics:`/`status:` for a pre-contract trace, is not.
- **`wiki/status.md` and `wiki/index/reasoning.md` are generated.** Never hand-edit. Run `node scripts/build-wiki-index.js`.
- **Inner loop is `node --test tests/wiki-budget.test.js`** (or the single relevant file). Run the full `npm test` gate exactly once, right before push. Do not push on a red or unrun suite.
- **Node 22, CommonJS, `'use strict'` at the top of every file, `node:`-prefixed built-in requires.** Match the style of `scripts/build-wiki-index.js` and `tests/wiki-index.test.js`.
- **No new npm dependencies.**
- **All paths in JSON config are repo-root-relative POSIX strings** (`wiki/topics/what-rig-is.md`), never absolute.

---

## Measured baseline (2026-09-05, branch `qa-prod-v7`)

These numbers set the caps and are what the plan will show as red. Re-measure before Task 3 if the branch has moved.

| Fact | Value |
|---|---|
| Reasoning traces | 194 |
| Traces with a non-empty `summary:` | 87 (**107 missing**) |
| Traces with no frontmatter block at all | 12 |
| `status:` distribution | 139 historical / 26 none / 23 current / 6 superseded |
| Largest hub | `wiki/topics/onboarding-flow.md` 36,775 B, 572 lines, 65 outbound links |
| Hubs over 12,000 B | 5 of 29 (onboarding-flow 36,775 · trust-and-failure-boundaries 26,607 · testing-strategy 21,267 · gate1-signing 15,190 · the-overhaul 14,349) |
| Indexes over 200 rows | 5 (traps 327 · decisions 314 · timeline 311 · invariants 308 · acceptance-cases 266) |
| Indexes over 20,000 B | 2 (decisions 55,724 · acceptance-cases 20,492) |
| Orientation cost: primer + the 12 pages it links | **211,775 B ≈ 53k tokens** |
| Non-`current` traces linked from the four mandated reads | **0** (this rule ships green, as a ratchet) |

---

## File Structure

| File | Responsibility |
|---|---|
| **Create** `scripts/wiki-budget.js` | Pure measurement. Reads config, walks `wiki/topics/`, `wiki/index/`, and trace frontmatter, returns a flat array of violation objects. Knows nothing about waivers, exit codes, or printing. |
| **Create** `scripts/check-wiki-budget.js` | Policy + CLI. Loads the waiver file, applies the ratchet, prints, exits 1 on a surviving violation. Owns `--update-waivers`. |
| **Create** `scripts/wiki-query.js` | Bounded retrieval CLI over the same trace frontmatter, with a hard output cap. This is the read path that replaces hub-browsing. |
| **Create** `wiki/budget.json` | Hand-edited caps and the two page lists. Changing a cap is a deliberate, reviewable edit. |
| **Create** `wiki/budget.waivers.json` | Machine-generated debt ledger. One key per current violation. Values may only shrink; entries may only be deleted. |
| **Create** `tests/wiki-budget.test.js` | Fixture tests for every rule and for the waiver ratchet, plus one assertion that the real repository is within budget-or-waiver. Its existence is what wires the gate into `npm test`. |
| **Create** `tests/wiki-query.test.js` | Fixture tests for filters, the hard cap, and the empty-result contract. |
| **Modify** `wiki/index/quick-reference.md` | One row pointing at the query tool; one standing fact about the budget gate. |
| **Modify** `wiki/topics/agent-working-conventions.md` | The hub that owns "how agents read and write this wiki" gains the gate. |
| **Create** `wiki/reasoning/2026-09-05-wiki-budget-gate.md` | The trace for this change, per `wiki/reasoning/README.md`. |

---

## Design decisions, with their reasons

Read these before Task 1. They are the non-obvious calls, and a reviewer will ask about each.

**1. The gate ships green with a waiver ledger, not red.** The spec says "land it red." This repo's standing rule is "do not push on a red or unrun suite" (`CLAUDE.md` § Checks), and a permanently-red `npm test` disables every other check for everyone. `--update-waivers` writes one key per current violation with its current value; the checker then fails if a waived value *grows*, if a waiver is *stale* (the file is now within budget but the waiver is still there), or if a *new* violation appears with no waiver. The debt is enumerated, enforced, and can only shrink. The waiver file is also the partitionable work list the parallel debloat agents need. **To ship hard-red instead**, skip Task 3's `--update-waivers` run and commit an empty `{}`; nothing else changes.

**2. Generated pages are exempt from the size caps.** `wiki/status.md` and `wiki/index/reasoning.md` are rebuilt by `scripts/build-wiki-index.js` and must not be hand-edited. Capping a file nobody is allowed to edit produces a failure with no legal fix. `index/reasoning.md` grows one row per trace by design; the answer to "don't read the 202-row register" is Task 4's query tool, not a cap. Both files are still counted in the entry-path byte budget where they appear.

**3. Reachability is scoped to the four mandated reads, not to all hubs.** The literal reading — "no `status: historical` trace reachable from the default path" — would require deleting **85** trace citations from `topics/` and `index/`, and `wiki/reasoning/README.md` *requires* a hub to cite the trace it synthesises. That rule would order agents to break the wiki's own filing contract. What is enforceable and correct: the four pages a full-cadence task always opens — `agent-primer.md`, `Home.md`, `status.md`, `index/quick-reference.md` — link only `current` traces. That is true today (0 violations), so it ships as a ratchet that stops the regression rather than as debt.

**4. An entry-path byte budget is added beyond the four described assertions.** Per-file caps do not bound the sum, and the sum is the symptom the whole diagnosis rests on: 211,775 B ≈ 53k tokens before a single primary source is opened. Without it, five hubs could each sit at 11,999 B and the orientation cost would be unchanged. It is one rule and one constant; if the reviewer wants the plan held to exactly four assertions, delete `orientationViolations` and its config entry and nothing else breaks.

**5. Caps are bytes for hubs, rows *and* bytes for indexes.** A hub is prose; bytes are the honest unit. An index is a flat lookup — `agent-primer.md` says decisions.md is "every decision ID, one line each" — so it gets a row cap for length and a byte cap for prose creeping into rows. `wiki/index/decisions.md` violates both: 314 rows at a mean of 177 bytes per row.

---

## Task 1: Measurement core and the three size rules

**Files:**
- Create: `scripts/wiki-budget.js`
- Create: `wiki/budget.json`
- Create: `tests/wiki-budget.test.js`

**Interfaces:**
- Consumes: `traces(root)` from `scripts/build-wiki-index.js` — returns an array of `{ file, date, source, topics, decisions, status, supersedes, tags, summary }` where `file` is `reasoning/<name>.md` and `topics`/`decisions`/`tags` are arrays.
- Produces:
  - `audit(root) -> Violation[]` where `Violation = { rule: string, subject: string, actual: number|string, limit: number|string }`.
  - `CONFIG` (string, `'wiki/budget.json'`), `WAIVERS` (string, `'wiki/budget.waivers.json'`), `readConfig(root) -> object`, `pages(root, dir) -> { relative, bytes, rows }[]`.
  - Rule names, used as waiver-key prefixes in Task 3: `trace-summary`, `hub-bytes`, `index-rows`, `index-bytes`, and (Task 2) `entry-path-current-only`, `entry-path-bytes`, `entry-path-missing`.

- [ ] **Step 1: Write the config file**

Create `wiki/budget.json` exactly as below. `entryPath` is `agent-primer.md` plus every page it links; `mandatoryReads` is the subset a full-cadence task always opens.

```json
{
  "limits": {
    "hubBytes": 12000,
    "indexRows": 200,
    "indexBytes": 20000,
    "entryPathBytes": 100000
  },
  "mandatoryReads": [
    "wiki/agent-primer.md",
    "wiki/Home.md",
    "wiki/status.md",
    "wiki/index/quick-reference.md"
  ],
  "entryPath": [
    "wiki/agent-primer.md",
    "wiki/Home.md",
    "wiki/status.md",
    "wiki/index/quick-reference.md",
    "wiki/topics/the-overhaul.md",
    "wiki/topics/what-rig-is.md",
    "wiki/topics/onboarding-flow.md",
    "wiki/topics/graft-mechanics.md",
    "wiki/topics/the-two-gates.md",
    "wiki/index/decisions.md",
    "wiki/index/acceptance-cases.md",
    "wiki/index/rejected.md",
    "wiki/index/traps.md"
  ]
}
```

- [ ] **Step 2: Write the failing tests**

Create `tests/wiki-budget.test.js`. The `fixture` helper builds a throwaway wiki tree; every later task adds tests to this same file.

```js
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { audit } = require('../scripts/wiki-budget');

const DEFAULT_CONFIG = {
  limits: { hubBytes: 100, indexRows: 5, indexBytes: 200, entryPathBytes: 500 },
  mandatoryReads: ['wiki/agent-primer.md'],
  entryPath: ['wiki/agent-primer.md'],
};

// Builds a minimal wiki tree. `files` keys are repo-root-relative paths.
// `config` is merged over DEFAULT_CONFIG at the top level.
function fixture(files, config = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-wiki-budget-'));
  const tree = {
    'wiki/agent-primer.md': '# Primer\n',
    'wiki/topics/.keep.md': '',
    'wiki/index/.keep.md': '',
    ...files,
  };
  for (const [relative, body] of Object.entries(tree)) {
    const absolute = path.join(root, relative);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, body);
  }
  fs.mkdirSync(path.join(root, 'wiki', 'reasoning'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'wiki', 'budget.json'),
    JSON.stringify({ ...DEFAULT_CONFIG, ...config }, null, 2),
  );
  return root;
}

function rules(violations) {
  return violations.map((violation) => `${violation.rule}:${violation.subject}`).sort();
}

test('a trace with no summary is a violation and a trace with one is not', () => {
  const root = fixture({
    'wiki/reasoning/2026-01-01-bare.md': '---\ndate: 2026-01-01\nstatus: historical\nsummary:\n---\n# Bare\n',
    'wiki/reasoning/2026-01-02-full.md': '---\ndate: 2026-01-02\nstatus: historical\nsummary: A real one-liner.\n---\n# Full\n',
  });
  assert.deepEqual(rules(audit(root)), ['trace-summary:wiki/reasoning/2026-01-01-bare.md']);
});

test('a pre-contract trace with no frontmatter at all is a summary violation', () => {
  const root = fixture({ 'wiki/reasoning/2026-01-03-legacy.md': '# Legacy\n\nBody only.\n' });
  assert.deepEqual(rules(audit(root)), ['trace-summary:wiki/reasoning/2026-01-03-legacy.md']);
});

test('a hub over the byte cap is a violation and reports actual and limit', () => {
  const root = fixture({ 'wiki/topics/big.md': 'x'.repeat(101) });
  const [violation] = audit(root).filter((row) => row.rule === 'hub-bytes');
  assert.equal(violation.subject, 'wiki/topics/big.md');
  assert.equal(violation.actual, 101);
  assert.equal(violation.limit, 100);
});

test('an index over the row cap and over the byte cap reports both rules', () => {
  const root = fixture({ 'wiki/index/wide.md': `${'row of text\n'.repeat(20)}` });
  assert.deepEqual(
    rules(audit(root).filter((row) => row.rule.startsWith('index-'))),
    ['index-bytes:wiki/index/wide.md', 'index-rows:wiki/index/wide.md'],
  );
});

test('generated pages are exempt from the index caps', () => {
  const root = fixture({ 'wiki/index/reasoning.md': `${'row of text\n'.repeat(20)}` });
  assert.deepEqual(audit(root).filter((row) => row.rule.startsWith('index-')), []);
});

test('README.md is not audited as a hub or an index', () => {
  const root = fixture({
    'wiki/topics/README.md': 'x'.repeat(500),
    'wiki/index/README.md': 'x'.repeat(500),
  });
  assert.deepEqual(audit(root), []);
});
```

- [ ] **Step 3: Run the tests to verify they fail**

```sh
node --test tests/wiki-budget.test.js
```
Expected: FAIL — `Cannot find module '../scripts/wiki-budget'`.

- [ ] **Step 4: Write the measurement module**

Create `scripts/wiki-budget.js`:

```js
#!/usr/bin/env node
'use strict';

// Measures the wiki's read cost against the caps in wiki/budget.json. This
// module is pure measurement: it reports what is over budget and says nothing
// about whether that is allowed. Waivers, exit codes, and printing belong to
// scripts/check-wiki-budget.js.
const fs = require('node:fs');
const path = require('node:path');
const { traces } = require('./build-wiki-index');

const ROOT = path.join(__dirname, '..');
const CONFIG = path.join('wiki', 'budget.json');
const WAIVERS = path.join('wiki', 'budget.waivers.json');

// Rebuilt by scripts/build-wiki-index.js and forbidden to hand-edit, so a size
// cap on them would fail the build with no legal fix. They stay inside the
// entry-path byte budget, where the fix is to change what links to them.
const GENERATED = new Set([
  path.posix.join('wiki', 'status.md'),
  path.posix.join('wiki', 'index', 'reasoning.md'),
]);

function readConfig(root) {
  return JSON.parse(fs.readFileSync(path.join(root, CONFIG), 'utf8'));
}

function pages(root, directory) {
  const absolute = path.join(root, 'wiki', directory);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute)
    .filter((name) => name.endsWith('.md') && name !== 'README.md')
    .sort()
    .map((name) => {
      const body = fs.readFileSync(path.join(absolute, name), 'utf8');
      return {
        relative: path.posix.join('wiki', directory, name),
        bytes: Buffer.byteLength(body),
        // Trailing-newline convention: a file ending in "\n" has as many rows
        // as newlines, which is what `wc -l` reports and what the caps mean.
        rows: body.split('\n').length - 1,
      };
    })
    .filter((page) => !GENERATED.has(page.relative));
}

// A populated summary lets an agent triage a trace from the index without
// opening the body — wiki/reasoning/README.md calls this the single
// highest-ROI context-debloat lever this project has identified.
function summaryViolations(root) {
  return traces(root)
    .filter((trace) => !trace.summary)
    .map((trace) => ({
      rule: 'trace-summary',
      subject: path.posix.join('wiki', trace.file),
      actual: 'missing',
      limit: 'one line',
    }));
}

function hubViolations(root, limits) {
  return pages(root, 'topics')
    .filter((page) => page.bytes > limits.hubBytes)
    .map((page) => ({
      rule: 'hub-bytes', subject: page.relative, actual: page.bytes, limit: limits.hubBytes,
    }));
}

// An index is a flat lookup, so it is capped on length and on prose creeping
// into its rows. wiki/index/decisions.md fails both at 314 rows / 177 bytes
// per row against a page the primer describes as "one line each".
function indexViolations(root, limits) {
  const found = [];
  for (const page of pages(root, 'index')) {
    if (page.rows > limits.indexRows) {
      found.push({ rule: 'index-rows', subject: page.relative, actual: page.rows, limit: limits.indexRows });
    }
    if (page.bytes > limits.indexBytes) {
      found.push({ rule: 'index-bytes', subject: page.relative, actual: page.bytes, limit: limits.indexBytes });
    }
  }
  return found;
}

function audit(root = ROOT) {
  const config = readConfig(root);
  return [
    ...summaryViolations(root),
    ...hubViolations(root, config.limits),
    ...indexViolations(root, config.limits),
  ];
}

module.exports = { CONFIG, GENERATED, WAIVERS, audit, pages, readConfig };
```

- [ ] **Step 5: Run the tests to verify they pass**

```sh
node --test tests/wiki-budget.test.js
```
Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```sh
git add scripts/wiki-budget.js wiki/budget.json tests/wiki-budget.test.js
git commit -m "feat(wiki): measure hub, index, and trace-summary budgets"
```

---

## Task 2: Entry-path rules

**Files:**
- Modify: `scripts/wiki-budget.js`
- Modify: `tests/wiki-budget.test.js`

**Interfaces:**
- Consumes: `readConfig(root)` and the `Violation` shape from Task 1; `config.mandatoryReads` and `config.entryPath` from `wiki/budget.json`.
- Produces: three more rule names on `audit`'s output — `entry-path-current-only`, `entry-path-bytes`, `entry-path-missing`.

- [ ] **Step 1: Write the failing tests**

Append to `tests/wiki-budget.test.js`:

```js
test('a mandated read that links a non-current trace is a violation', () => {
  const root = fixture({
    'wiki/agent-primer.md': 'See [old](reasoning/2026-01-01-old.md) and [now](reasoning/2026-01-02-now.md).\n',
    'wiki/reasoning/2026-01-01-old.md': '---\ndate: 2026-01-01\nstatus: historical\nsummary: Old.\n---\n# Old\n',
    'wiki/reasoning/2026-01-02-now.md': '---\ndate: 2026-01-02\nstatus: current\nsummary: Now.\n---\n# Now\n',
  });
  assert.deepEqual(
    rules(audit(root).filter((row) => row.rule === 'entry-path-current-only')),
    ['entry-path-current-only:wiki/agent-primer.md -> reasoning/2026-01-01-old.md'],
  );
});

test('a mandated read may link reasoning/README.md, which is not a trace', () => {
  const root = fixture({ 'wiki/agent-primer.md': 'See [how](reasoning/README.md).\n' });
  assert.deepEqual(audit(root).filter((row) => row.rule === 'entry-path-current-only'), []);
});

test('a hub deeper than the mandated reads may cite a historical trace', () => {
  const root = fixture({
    'wiki/topics/hub.md': 'See [old](../reasoning/2026-01-01-old.md).\n',
    'wiki/reasoning/2026-01-01-old.md': '---\ndate: 2026-01-01\nstatus: historical\nsummary: Old.\n---\n# Old\n',
  });
  assert.deepEqual(audit(root).filter((row) => row.rule === 'entry-path-current-only'), []);
});

test('the entry path is capped on total bytes across its pages', () => {
  const root = fixture(
    { 'wiki/agent-primer.md': 'a'.repeat(300), 'wiki/Home.md': 'b'.repeat(300) },
    { entryPath: ['wiki/agent-primer.md', 'wiki/Home.md'] },
  );
  const [violation] = audit(root).filter((row) => row.rule === 'entry-path-bytes');
  assert.equal(violation.actual, 600);
  assert.equal(violation.limit, 500);
});

test('an entry-path page that no longer exists fails instead of being skipped', () => {
  const root = fixture({}, { entryPath: ['wiki/agent-primer.md', 'wiki/index/gone.md'] });
  assert.deepEqual(
    rules(audit(root).filter((row) => row.rule === 'entry-path-missing')),
    ['entry-path-missing:wiki/index/gone.md'],
  );
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```sh
node --test tests/wiki-budget.test.js
```
Expected: FAIL — the four new `entry-path-*` assertions get `[]`, and the missing-page test throws `ENOENT` or returns `[]`.

- [ ] **Step 3: Add the entry-path rules**

In `scripts/wiki-budget.js`, insert after `indexViolations` and before `audit`:

```js
// Only dated trace filenames. wiki/reasoning/README.md is a convention page,
// not a trace, and linking it from a mandated read is correct.
const TRACE_LINK = /\]\((?:\.{1,2}\/)*(reasoning\/\d{4}-\d{2}-\d{2}-[^)#\s]+\.md)/g;

// The four pages a full-cadence task always opens must route only to current
// thinking. Hubs one hop deeper may and should cite historical traces: a hub
// is the synthesis and the trace is its source, and wiki/reasoning/README.md
// requires the citation. Enforcing this on hubs would order agents to break
// the wiki's own filing contract.
function entryLinkViolations(root, config) {
  const status = new Map(traces(root).map((trace) => [trace.file, trace.status]));
  const found = [];
  for (const relative of config.mandatoryReads) {
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute)) continue;
    const body = fs.readFileSync(absolute, 'utf8');
    for (const target of new Set([...body.matchAll(TRACE_LINK)].map((match) => match[1]))) {
      const state = status.get(target) || 'missing';
      if (state === 'current') continue;
      found.push({
        rule: 'entry-path-current-only',
        subject: `${relative} -> ${target}`,
        actual: state,
        limit: 'current',
      });
    }
  }
  return found;
}

// Per-file caps do not bound the sum, and the sum is the symptom: orientation
// cost was 211,775 bytes (~53k tokens) on 2026-09-05 before a single primary
// source was opened. A missing page fails loudly rather than shrinking the
// measured total, so splitting a page cannot silently satisfy the budget.
function orientationViolations(root, config, limits) {
  const found = [];
  let bytes = 0;
  for (const relative of config.entryPath) {
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute)) {
      found.push({ rule: 'entry-path-missing', subject: relative, actual: 'absent', limit: 'update wiki/budget.json' });
      continue;
    }
    bytes += fs.statSync(absolute).size;
  }
  if (bytes > limits.entryPathBytes) {
    found.push({
      rule: 'entry-path-bytes',
      subject: 'wiki/agent-primer.md and the pages it links',
      actual: bytes,
      limit: limits.entryPathBytes,
    });
  }
  return found;
}
```

Then extend `audit`:

```js
function audit(root = ROOT) {
  const config = readConfig(root);
  return [
    ...summaryViolations(root),
    ...hubViolations(root, config.limits),
    ...indexViolations(root, config.limits),
    ...entryLinkViolations(root, config),
    ...orientationViolations(root, config, config.limits),
  ];
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```sh
node --test tests/wiki-budget.test.js
```
Expected: PASS, 11 tests.

- [ ] **Step 5: Commit**

```sh
git add scripts/wiki-budget.js tests/wiki-budget.test.js
git commit -m "feat(wiki): cap the orientation read path and its trace links"
```

---

## Task 3: The waiver ratchet, the CLI, and the live gate

This is the task that turns measurement into a gate. After it, `npm test` enforces the budget on every push.

**Files:**
- Create: `scripts/check-wiki-budget.js`
- Create: `wiki/budget.waivers.json`
- Modify: `tests/wiki-budget.test.js`

**Interfaces:**
- Consumes: `audit(root)`, `WAIVERS` from `scripts/wiki-budget.js`.
- Produces: `check(root) -> Violation[]` where each element additionally carries `kind: 'over-budget' | 'waiver-exceeded' | 'stale-waiver'`; `readWaivers(root) -> Record<string, number|string>`; `key(violation) -> string` (`` `${rule}:${subject}` ``).

- [ ] **Step 1: Write the failing tests**

Append to `tests/wiki-budget.test.js`. Add the import at the top of the file, next to the existing one:

```js
const { check } = require('../scripts/check-wiki-budget');
```

```js
function waive(root, waivers) {
  fs.writeFileSync(path.join(root, 'wiki', 'budget.waivers.json'), `${JSON.stringify(waivers, null, 2)}\n`);
  return root;
}

test('a waiver at the current value suppresses the violation', () => {
  const root = waive(fixture({ 'wiki/topics/big.md': 'x'.repeat(101) }), { 'hub-bytes:wiki/topics/big.md': 101 });
  assert.deepEqual(check(root), []);
});

test('growth past a waived value fails as waiver-exceeded', () => {
  const root = waive(fixture({ 'wiki/topics/big.md': 'x'.repeat(150) }), { 'hub-bytes:wiki/topics/big.md': 101 });
  const [violation] = check(root);
  assert.equal(violation.kind, 'waiver-exceeded');
  assert.equal(violation.actual, 150);
  assert.equal(violation.limit, 101);
});

test('a waiver for a file now within budget fails as stale', () => {
  const root = waive(fixture({ 'wiki/topics/small.md': 'x'.repeat(10) }), { 'hub-bytes:wiki/topics/small.md': 101 });
  const [violation] = check(root);
  assert.equal(violation.kind, 'stale-waiver');
  assert.equal(violation.subject, 'hub-bytes:wiki/topics/small.md');
});

test('a new violation with no waiver fails as over-budget', () => {
  const root = waive(fixture({ 'wiki/topics/big.md': 'x'.repeat(101) }), {});
  const [violation] = check(root);
  assert.equal(violation.kind, 'over-budget');
});

test('a non-numeric violation is suppressed by any waiver and cannot regress', () => {
  const root = waive(
    fixture({ 'wiki/reasoning/2026-01-01-bare.md': '---\ndate: 2026-01-01\nstatus: historical\nsummary:\n---\n# Bare\n' }),
    { 'trace-summary:wiki/reasoning/2026-01-01-bare.md': 'missing' },
  );
  assert.deepEqual(check(root), []);
});

test('a missing waiver file means no waivers, not a crash', () => {
  const root = fixture({ 'wiki/topics/big.md': 'x'.repeat(101) });
  assert.equal(check(root).length, 1);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```sh
node --test tests/wiki-budget.test.js
```
Expected: FAIL — `Cannot find module '../scripts/check-wiki-budget'`.

- [ ] **Step 3: Write the policy CLI**

Create `scripts/check-wiki-budget.js`:

```js
#!/usr/bin/env node
'use strict';

// Applies wiki/budget.waivers.json to the measurements from wiki-budget.js.
//
// The waiver file is a ratchet, not an escape hatch. It records one key per
// violation that existed when the gate was installed, so the suite is green
// while every item of debt is enumerated and owned. Three things fail:
// a waived value that grew, a waiver whose file is now within budget, and any
// violation with no waiver at all. Nothing here can make the wiki bigger
// without an explicit, reviewable edit to the ledger.
const fs = require('node:fs');
const path = require('node:path');
const { WAIVERS, audit } = require('./wiki-budget');

const ROOT = path.join(__dirname, '..');

function key(violation) {
  return `${violation.rule}:${violation.subject}`;
}

function readWaivers(root) {
  const file = path.join(root, WAIVERS);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

function check(root = ROOT) {
  const waivers = readWaivers(root);
  const unused = new Set(Object.keys(waivers));
  const failures = [];
  for (const violation of audit(root)) {
    const identifier = key(violation);
    unused.delete(identifier);
    if (!(identifier in waivers)) {
      failures.push({ ...violation, kind: 'over-budget' });
      continue;
    }
    const allowance = waivers[identifier];
    if (typeof violation.actual === 'number' && violation.actual > allowance) {
      failures.push({ ...violation, kind: 'waiver-exceeded', limit: allowance });
    }
  }
  for (const identifier of unused) {
    failures.push({
      rule: 'stale-waiver',
      subject: identifier,
      actual: 'now within budget',
      limit: 'delete this waiver',
      kind: 'stale-waiver',
    });
  }
  return failures;
}

// Rewrites the ledger from the current state. Run this only when installing
// the gate, or when the intent owner has accepted new debt on purpose.
function updateWaivers(root = ROOT) {
  const recorded = Object.fromEntries(
    audit(root).sort((left, right) => key(left).localeCompare(key(right)))
      .map((violation) => [key(violation), violation.actual]),
  );
  fs.writeFileSync(path.join(root, WAIVERS), `${JSON.stringify(recorded, null, 2)}\n`);
  return Object.keys(recorded).length;
}

if (require.main === module) {
  if (process.argv.includes('--update-waivers')) {
    console.log(`wiki budget: recorded ${updateWaivers()} waiver(s) in ${WAIVERS}`);
    process.exit(0);
  }
  const failures = check();
  if (!failures.length) {
    console.log('wiki budget: within caps and waivers');
    process.exit(0);
  }
  for (const failure of failures) {
    console.error(`  ${failure.kind} ${failure.rule} ${failure.subject}: ${failure.actual} (limit ${failure.limit})`);
  }
  console.error(`\n${failures.length} wiki budget failure(s). See wiki/budget.json for the caps.`);
  process.exit(1);
}

module.exports = { check, key, readWaivers, updateWaivers };
```

- [ ] **Step 4: Run the tests to verify they pass**

```sh
node --test tests/wiki-budget.test.js
```
Expected: PASS, 17 tests.

- [ ] **Step 5: Generate the real waiver ledger**

```sh
node scripts/check-wiki-budget.js --update-waivers
node scripts/check-wiki-budget.js
```
Expected: the first prints roughly `wiki budget: recorded 120 waiver(s)`; the second prints `wiki budget: within caps and waivers` and exits 0.

Sanity-check the ledger against the measured baseline before committing it:

```sh
node -e "const w=require('./wiki/budget.waivers.json');const c={};for(const k of Object.keys(w))c[k.split(':')[0]]=(c[k.split(':')[0]]||0)+1;console.log(c)"
```
Expected, approximately: `{ 'entry-path-bytes': 1, 'hub-bytes': 5, 'index-bytes': 2, 'index-rows': 5, 'trace-summary': 107 }`. If `trace-summary` is far from 107 or any other count is far from these, stop and re-measure rather than committing a ledger that hides real debt.

- [ ] **Step 6: Add the live-repository assertion**

Append to `tests/wiki-budget.test.js`. This test is why the gate is a gate: it runs against the real tree on every `npm test`.

```js
test('the committed wiki is within its budgets and waivers', () => {
  const failures = check(path.join(__dirname, '..'));
  assert.deepEqual(
    failures.map((failure) => `${failure.kind} ${failure.rule} ${failure.subject}`),
    [],
  );
});
```

- [ ] **Step 7: Run the tests to verify they pass**

```sh
node --test tests/wiki-budget.test.js
```
Expected: PASS, 18 tests. If the live assertion fails with `stale-waiver`, the tree changed since Step 5 — re-run `--update-waivers` and re-check the counts.

- [ ] **Step 8: Verify the gate is wired without touching the signed oracle**

```sh
git diff --stat -- package.json wiki/gate1
```
Expected: no output. The gate reaches `npm test` purely through `tests/*.test.js`.

- [ ] **Step 9: Commit**

```sh
git add scripts/check-wiki-budget.js wiki/budget.waivers.json tests/wiki-budget.test.js
git commit -m "feat(wiki): enforce the budget in CI behind a ratchet-only waiver ledger"
```

---

## Task 4: The bounded query tool

The read half of the fix. An agent asks a scoped question and gets a capped answer instead of opening a 572-line hub or the 202-row register.

**Files:**
- Create: `scripts/wiki-query.js`
- Create: `tests/wiki-query.test.js`

**Interfaces:**
- Consumes: `traces(root)` from `scripts/build-wiki-index.js`.
- Produces: `query(root, options) -> { rows: Trace[], total: number, limit: number }` and `render(result) -> string`. `options` is `{ topic, tag, status, since, decision, text, limit }`, every field optional.

- [ ] **Step 1: Write the failing tests**

Create `tests/wiki-query.test.js`:

```js
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { HARD_CAP, parse, query, render } = require('../scripts/wiki-query');

function fixture(count, overrides = () => ({})) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-wiki-query-'));
  fs.mkdirSync(path.join(root, 'wiki', 'reasoning'), { recursive: true });
  for (let i = 1; i <= count; i += 1) {
    const day = String(i).padStart(2, '0');
    const fields = { topics: 'safety', tags: 'trap', status: 'historical', decisions: 'D1', ...overrides(i) };
    fs.writeFileSync(
      path.join(root, 'wiki', 'reasoning', `2026-01-${day}-trace-${i}.md`),
      `---\ndate: 2026-01-${day}\nsource: agent\ntopics: ${fields.topics}\ndecisions: ${fields.decisions}\nstatus: ${fields.status}\nsupersedes:\ntags: ${fields.tags}\nsummary: Trace number ${i}.\n---\n# Trace ${i}\n`,
    );
  }
  return root;
}

test('results are capped and the caller is told how many were withheld', () => {
  const result = query(fixture(30), { limit: 5 });
  assert.equal(result.rows.length, 5);
  assert.equal(result.total, 30);
  assert.match(render(result), /25 more match/);
});

test('the hard cap cannot be raised past HARD_CAP by --limit', () => {
  const result = query(fixture(80), { limit: 500 });
  assert.equal(result.rows.length, HARD_CAP);
});

test('filters compose and narrow the result', () => {
  const root = fixture(10, (i) => ({ topics: i % 2 ? 'safety' : 'signing', status: i === 3 ? 'current' : 'historical' }));
  assert.equal(query(root, { topic: 'signing' }).total, 5);
  assert.equal(query(root, { topic: 'safety', status: 'current' }).total, 1);
  assert.equal(query(root, { since: '2026-01-08' }).total, 3);
  assert.equal(query(root, { text: 'number 7' }).total, 1);
});

test('a query that matches nothing returns an empty result and says so', () => {
  const result = query(fixture(5), { topic: 'nonsense' });
  assert.equal(result.total, 0);
  assert.match(render(result), /no traces match/i);
});

test('newest results come first', () => {
  const [first] = query(fixture(5), {}).rows;
  assert.equal(first.date, '2026-01-05');
});

test('parse rejects a flag with no value instead of silently ignoring it', () => {
  assert.throws(() => parse(['--topic']), /--topic needs a value/);
  assert.throws(() => parse(['topic', 'safety']), /unknown argument: topic/);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```sh
node --test tests/wiki-query.test.js
```
Expected: FAIL — `Cannot find module '../scripts/wiki-query'`.

- [ ] **Step 3: Write the query tool**

Create `scripts/wiki-query.js`:

```js
#!/usr/bin/env node
'use strict';

// The bounded read. wiki/agent-primer.md's links are advisory and unbounded;
// this is the middle mode that was missing — ask a scoped question, get an
// answer whose size you knew before you asked. The cap is the entire point:
// raising it past HARD_CAP is refused, because an unbounded answer is the
// thing this replaces.
const path = require('node:path');
const { traces } = require('./build-wiki-index');

const ROOT = path.join(__dirname, '..');
const DEFAULT_LIMIT = 12;
const HARD_CAP = 40;

const USAGE = `Usage: node scripts/wiki-query.js [--topic <slug>] [--tag <tag>]
       [--status current|superseded|historical] [--since YYYY-MM-DD]
       [--decision <id>] [--text <substring>] [--limit <n>]

Returns matching reasoning traces, newest first, at most ${HARD_CAP}.
Topic slugs are the filenames in wiki/topics/ without the .md extension.`;

function parse(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (!flag.startsWith('--')) throw new Error(`unknown argument: ${flag}`);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) throw new Error(`${flag} needs a value`);
    options[flag.slice(2)] = value;
    i += 1;
  }
  return options;
}

function matches(trace, options) {
  if (options.topic && !trace.topics.includes(options.topic)) return false;
  if (options.tag && !trace.tags.includes(options.tag)) return false;
  if (options.status && trace.status !== options.status) return false;
  if (options.decision && !trace.decisions.includes(options.decision)) return false;
  if (options.since && trace.date < options.since) return false;
  if (options.text && !`${trace.file} ${trace.summary}`.toLowerCase().includes(options.text.toLowerCase())) return false;
  return true;
}

function query(root = ROOT, options = {}) {
  // traces() already sorts newest first.
  const matched = traces(root).filter((trace) => matches(trace, options));
  const requested = Number(options.limit) || DEFAULT_LIMIT;
  const limit = Math.max(1, Math.min(requested, HARD_CAP));
  return { rows: matched.slice(0, limit), total: matched.length, limit };
}

function render(result) {
  if (!result.total) return 'No traces match. Widen the query or drop a filter.\n';
  const lines = result.rows.map((trace) => `${trace.date}  wiki/${trace.file}\n            ${trace.summary || '(no summary filed)'}`);
  const withheld = result.total - result.rows.length;
  if (withheld > 0) {
    lines.push(`\n${withheld} more match. Narrow with --topic/--status/--since, or raise --limit (max ${HARD_CAP}).`);
  }
  return `${lines.join('\n')}\n`;
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(USAGE);
    process.exit(0);
  }
  try {
    process.stdout.write(render(query(ROOT, parse(argv))));
  } catch (error) {
    console.error(`${error.message}\n\n${USAGE}`);
    process.exit(2);
  }
}

module.exports = { DEFAULT_LIMIT, HARD_CAP, parse, query, render };
```

- [ ] **Step 4: Run the tests to verify they pass**

```sh
node --test tests/wiki-query.test.js
```
Expected: PASS, 6 tests.

- [ ] **Step 5: Verify against the real wiki**

```sh
node scripts/wiki-query.js --topic gate1-signing
node scripts/wiki-query.js --tag trap --limit 5
node scripts/wiki-query.js --topic nonsense
```
Expected: the first two print capped, summarised lists and exit 0; the third prints `No traces match.` and exits 0. Confirm the first two are visibly shorter than the hubs they replace.

- [ ] **Step 6: Commit**

```sh
git add scripts/wiki-query.js tests/wiki-query.test.js
git commit -m "feat(wiki): add a hard-capped trace query for the bounded read path"
```

---

## Task 5: Wiki sync, full gate, and PR

`CLAUDE.md` requires the wiki to move in the same change as anything that moves what is true. This change moves what is true about how agents read the wiki, so it is part of the deliverable, not documentation.

**Files:**
- Create: `wiki/reasoning/2026-09-05-wiki-budget-gate.md`
- Modify: `wiki/topics/agent-working-conventions.md`
- Modify: `wiki/index/quick-reference.md`
- Regenerate: `wiki/status.md`, `wiki/index/reasoning.md`

- [ ] **Step 1: File the reasoning trace**

Create `wiki/reasoning/2026-09-05-wiki-budget-gate.md`. Fill the body with what was actually built and measured — do not copy this plan into it. The frontmatter must be exactly this shape:

```markdown
---
date: 2026-09-05
source: agent
topics: agent-working-conventions, the-overhaul, testing-strategy
decisions:
status: current
supersedes:
tags: interdependency
summary: The wiki budget gate ships — caps on hub bytes, index rows and bytes, trace summaries, and total orientation cost, enforced from tests/wiki-budget.test.js behind a ratchet-only waiver ledger, plus scripts/wiki-query.js as the bounded read that replaces hub browsing.
---
```

The body must record, at minimum: the five caps and the number each was set from; the waiver count by rule from Task 3 Step 5; why the gate entered CI through a test file rather than `package.json` (the signed oracle); why reachability was scoped to the four mandated reads rather than all 85 hub citations; and that the summary backfill, hub splits, and index splits are the follow-on parallel work the ledger enumerates.

- [ ] **Step 2: Update the hub named in `topics:`**

`wiki/topics/agent-working-conventions.md` is the hub that owns how agents read and write this wiki. Add a section citing the new trace by filename. Keep it under the 12,000-byte hub cap — the file is 10,212 B, so the addition has under 1,800 bytes of headroom. If it does not fit, trim an older section rather than raising the cap.

```markdown
## The wiki budget gate

`npm test` measures what the wiki costs to read. `wiki/budget.json` holds the
caps — 12,000 bytes per topic hub, 200 rows and 20,000 bytes per index, a
non-empty `summary:` on every trace, only `current` traces linked from the four
mandated reads, and 100,000 bytes total across the primer and everything it
links. `wiki/budget.waivers.json` records every violation that existed when the
gate was installed; a waived value may shrink and may be deleted, never grow.
Adding a waiver is an explicit edit, not a side effect.

The bounded read is `node scripts/wiki-query.js --topic <slug>`, capped at 40
rows. Prefer it to opening a hub when you know what you are looking for.

Filed in [wiki budget gate](../reasoning/2026-09-05-wiki-budget-gate.md).
```

- [ ] **Step 3: Add the query tool to the quick reference**

In `wiki/index/quick-reference.md` § "Standing facts worth knowing before you touch code", add:

```markdown
- **The wiki has a budget and `npm test` enforces it.** Caps in
  `wiki/budget.json`, current debt in `wiki/budget.waivers.json`. Waived values
  may shrink, never grow. Run `node scripts/check-wiki-budget.js` before you
  add a page.
- **`node scripts/wiki-query.js --topic <slug>` is the bounded read.** Capped
  at 40 rows, newest first, one summary line each. Use it instead of opening a
  hub when you already know the subject.
```

Then correct the line counts and check the 150-line cap:

```sh
node scripts/check-size-hints.js --fix
wc -l wiki/index/quick-reference.md
```
Expected: at most 150 lines. If over, delete a row that cannot change a decision — the page's own rule.

- [ ] **Step 4: Regenerate the generated pages**

```sh
node scripts/build-wiki-index.js
git diff --stat -- wiki/status.md wiki/index/reasoning.md
```
Expected: both files change to include the new trace.

- [ ] **Step 5: Pay for the growth this change caused**

Steps 1–4 grew three budgeted pages: `wiki/topics/agent-working-conventions.md` (Step 2), `wiki/index/quick-reference.md` (Step 3, and it is in `entryPath`), and `wiki/status.md` (Step 4, which gains a row for every new `current` trace and is also in `entryPath`). So this change *will* trip `entry-path-bytes` against the 211,775-byte figure recorded in Task 3. That is the gate working, and it is the first real test of whether the ratchet holds.

```sh
node scripts/check-wiki-budget.js
```

**Never run `--update-waivers` to clear this.** Regenerating the ledger to absorb your own addition is the +2,334-line failure mode the gate exists to stop. Take the legal remedies in this order:

1. **Demote stale `current` traces.** `wiki/status.md` renders only `status: current` traces, and 23 are currently marked so — several describe finished work (the PR #146 acceptance criteria, the Gate 1 package-scripts revert, the PR #146 hub sync). Changing `status: current` to `status: historical` in a trace's frontmatter is explicitly legal (`wiki/reasoning/README.md`: frontmatter is mutable, the body is not), and it is the deletion pressure this gate is meant to create. Then re-run `node scripts/build-wiki-index.js`.

```sh
node scripts/wiki-query.js --status current --limit 40
```

Use that list to pick the demotions, then verify the shrink:

```sh
node scripts/build-wiki-index.js && node scripts/check-wiki-budget.js
```

2. **Trim the page you grew.** Cut a row from `quick-reference.md` that cannot change a decision — the page's own stated rule — or tighten the hub section from Step 2.

3. **Only if 1 and 2 are both exhausted:** hand-edit the single `entry-path-bytes` value in `wiki/budget.waivers.json` to the new figure, and record in the Step 1 trace what the growth bought and why nothing could be demoted or trimmed. One key, by hand, with a written reason — never a regenerated file.

If it reports `stale-waiver` because a page dropped under its cap, delete that key from `wiki/budget.waivers.json`. That is the ratchet closing, and it is always correct.

Expected at the end of this step: `wiki budget: within caps and waivers`.

- [ ] **Step 6: Run the full gate**

```sh
npm test
```
Expected: exit 0, `Gate 1 protected: principal=gate1-owner ...`, and the four suites green. Confirm `tests/wiki-budget.test.js` and `tests/wiki-query.test.js` appear in the run. If Gate 1 reports `package.json scripts differ from the signed oracle snapshot`, `package.json` was edited somewhere — revert it; do not re-sign.

- [ ] **Step 7: Commit and open the PR**

`rig/tier-1/routing.md` step 9 requires the branch to be named `<ticket-id>-<slug>`. The work started on `qa-prod-v7`; move it onto a conforming branch before pushing. Substitute the real ticket ID if one exists for this work.

```sh
git add wiki/
git commit -m "docs(wiki): file the budget gate trace and sync its hub and index"
git checkout -b RIG-wiki-budget-gate
git push -u origin RIG-wiki-budget-gate
gh pr create --base prod --title "Wiki budget gate and bounded trace query" --body "$(cat <<'BODY'
Puts a machine oracle on the wiki's read cost and gives agents a bounded read.

- `scripts/wiki-budget.js` measures hub bytes, index rows and bytes, trace
  summaries, entry-path trace links, and total orientation cost.
- `scripts/check-wiki-budget.js` applies `wiki/budget.waivers.json` as a
  ratchet: a waived value may shrink or be deleted, never grow.
- `tests/wiki-budget.test.js` wires the gate into `npm test` through the
  existing `tests/*.test.js` glob, leaving the signed `package.json` scripts
  oracle untouched.
- `scripts/wiki-query.js` returns at most 40 summarised traces for a scoped
  question, replacing hub browsing as the default read.

Baseline it locks in: 107 traces without a summary, 5 hubs over 12,000 bytes,
5 indexes over 200 rows, and 211,775 bytes of orientation cost against a
100,000-byte cap. Every one of those is a waiver key and a unit of follow-on
work.
BODY
)"
```

Expected: the PR opens against `prod` and CI goes green.

---

## Follow-on work this gate enables (not in this plan)

The waiver ledger is the work list. Each of these deletes waiver keys and is safely parallelisable because the partitions do not share files:

| Slice | Waiver keys it clears | Partition |
|---|---|---|
| Summary backfill | 107 `trace-summary:*` | by month of the trace filename |
| Hub splits | 5 `hub-bytes:*` | one agent per hub |
| Index splits | 5 `index-rows:*` + 2 `index-bytes:*` | one agent per index |
| Free deletions (`wiki/archive/`, ~272 KB) | contributes to `entry-path-bytes` indirectly | one agent |

Give every such agent this verbatim: **a reasoning-trace body is written once and never edited. Changing frontmatter is legal, deleting or relocating a whole trace is legal, rewriting a hub or index is legal, rewriting a trace body is not.** And: **never run `--update-waivers`; delete keys, never add or raise them.**

`wiki/gate1/acceptance.md` (76,926 B) and `wiki/gate1/business-spec.md` (63,583 B) are excluded from every slice. They are signed; reflowing them invalidates the signature and costs a human re-sign ceremony.
