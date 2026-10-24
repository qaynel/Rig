# Wiki Maintenance Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Package the seven-step wiki sync + context-debloat routine as a repeatable, schedulable Claude Code skill backed by an authoring-time script.

**Architecture:** A new `.claude/skills/wiki-maintenance/SKILL.md` holds the routine as seven steps, each with a concrete "Skip if" done-marker so re-runs only touch outstanding work. A new `scripts/wiki-maintenance.js` provides `status` (a readiness report the skill reads first) and `lint` (two regression checks), reusing the exports of the existing `scripts/build-wiki-index.js`. A provenance reasoning trace and a topic-hub pointer record the addition and park two deferred ideas.

**Tech Stack:** Node.js (CommonJS, `node:` core modules, `node --test`), Markdown. No new dependencies.

**Spec:** `.context/attachments/Wlr36g/pasted_text_2026-09-02_00-12-28.txt` (the routine) and `.context/wiki-sync-and-context-debloat-research-brief.md` (its rationale). This plan packages that routine; it does not execute it.

## Global Constraints

- **Authoring-time only.** New code lives in `scripts/`. Nothing under `rig/tier-1/` may reference it. Tier 1 stays markdown-only in the installed payload.
- **Skill location:** `.claude/skills/wiki-maintenance/SKILL.md`. The name must NOT start with `rig-` — `.claude/skills/rig-*` is both gitignored (`rig/manifest.json` `ensure_gitignore_block`) and swept by the installer. `wiki-maintenance` is outside those globs, so it is tracked and stays repo-local.
- **Reuse, don't fork, the generator.** `scripts/wiki-maintenance.js` requires `./build-wiki-index` and uses its exported `traces` and `render`. Do not reimplement trace parsing.
- **Test wiring:** node tests are `tests/*.test.js`, run by `npm run test:code` via `node --test tests/*.test.js`. `npm test` is the full gate.
- **Do NOT wire `wiki-maintenance.js lint` into `npm test` in this plan.** That is Step 6 of the routine itself, which the skill performs later under its own provenance trace. This plan only adds the tooling and the doc.
- **Version guard:** `scripts/check-versions.js` only inspects eight named manifest files; adding a script or skill does not require a version bump, and there is no root `VERSION`/`CHANGELOG.md`.
- **Function signatures (used across tasks, keep verbatim):**
  - `report(root, records, dateOf)` → `Array<{ step: number, title: string, state: 'DONE'|'PENDING'|'RECURRING', findings: string[] }>`
  - `currentTraces(root, records)` → `Array<{ file: string, shipped: boolean }>`
  - `untaggedTraces(root)` → `Array<{ file: string, missing: string[] }>`
  - `staleHubs(root, records, dateOf)` → `Array<{ slug: string, hubDate: string, newestTraceDate: string }>`
  - `lintFindings(root, records, dateOf)` → `string[]`
  - `dateOf` defaults to `(rel) => gitDate(root, rel)`; tests pass a fake.
  - `records` is always `traces(root)` from `./build-wiki-index`.

---

### Task 1: `scripts/wiki-maintenance.js` — `status` report + CLI

**Files:**
- Create: `scripts/wiki-maintenance.js`
- Test: `tests/wiki-maintenance.test.js`

**Interfaces:**
- Consumes: `traces`, `render` from `scripts/build-wiki-index.js`. `traces(root)` returns records shaped `{ file, date, source, topics: string[], decisions: string[], status, supersedes, tags: string[], summary }` where `file` is `reasoning/<name>.md`.
- Produces: `report`, `currentTraces`, `untaggedTraces`, `staleHubs`, `gitDate` (all exported).

- [ ] **Step 1: Write the failing test**

Create `tests/wiki-maintenance.test.js`:

```js
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { traces } = require('../scripts/build-wiki-index');
const { report, currentTraces, untaggedTraces, staleHubs } = require('../scripts/wiki-maintenance');

const repoRoot = path.join(__dirname, '..');

function fixture(traceFiles, hubFiles = {}, ticketFiles = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-wiki-maint-'));
  fs.mkdirSync(path.join(root, 'wiki', 'reasoning'), { recursive: true });
  fs.mkdirSync(path.join(root, 'wiki', 'topics'), { recursive: true });
  fs.mkdirSync(path.join(root, 'wiki', 'tickets'), { recursive: true });
  fs.mkdirSync(path.join(root, 'wiki', 'index'), { recursive: true });
  fs.writeFileSync(path.join(root, 'wiki', 'reasoning', 'README.md'), '# Reasoning traces\n');
  fs.writeFileSync(path.join(root, 'wiki', 'Home.md'), '# Rig\n');
  fs.writeFileSync(path.join(root, 'CLAUDE.md'), 'read the wiki\n');
  fs.writeFileSync(path.join(root, 'package.json'), '{"scripts":{}}\n');
  for (const [name, body] of Object.entries(traceFiles)) {
    fs.writeFileSync(path.join(root, 'wiki', 'reasoning', name), body);
  }
  for (const [name, body] of Object.entries(hubFiles)) {
    fs.writeFileSync(path.join(root, 'wiki', 'topics', name), body);
  }
  for (const [name, body] of Object.entries(ticketFiles)) {
    fs.writeFileSync(path.join(root, 'wiki', 'tickets', name), body);
  }
  return root;
}

test('currentTraces flags close-out traces as shipped and leaves open work', () => {
  const root = fixture({
    '2026-09-01-feature-close-out.md':
      '---\ndate: 2026-09-01\nsource: agent\ntopics: safety\ndecisions: D1\nstatus: current\nsupersedes:\ntags:\nsummary: Feature X close-out.\n---\n# Done\nRIG-1 has shipped.\n',
    '2026-09-01-feature-wip.md':
      '---\ndate: 2026-09-01\nsource: agent\ntopics: safety\ndecisions:\nstatus: current\nsupersedes:\ntags:\nsummary: Feature Y underway.\n---\n# In progress\nStill open.\n',
  });
  const rows = currentTraces(root, traces(root));
  const byName = Object.fromEntries(rows.map((r) => [path.basename(r.file), r.shipped]));
  assert.equal(byName['2026-09-01-feature-close-out.md'], true);
  assert.equal(byName['2026-09-01-feature-wip.md'], false);
});

test('untaggedTraces reports traces missing status or topics frontmatter', () => {
  const root = fixture({
    '2026-08-01-old-untagged.md': '---\ndate: 2026-08-01\nsource: agent\n---\n# Old\n',
    '2026-09-02-tagged.md':
      '---\ndate: 2026-09-02\nsource: agent\ntopics: safety\ndecisions:\nstatus: historical\nsupersedes:\ntags:\nsummary:\n---\n# New\n',
  });
  const rows = untaggedTraces(root);
  assert.equal(rows.length, 1);
  assert.equal(path.basename(rows[0].file), '2026-08-01-old-untagged.md');
  assert.deepEqual(rows[0].missing.sort(), ['status', 'topics']);
});

test('staleHubs flags a hub older than its newest cited trace', () => {
  const root = fixture(
    {
      '2026-09-02-x.md':
        '---\ndate: 2026-09-02\nsource: agent\ntopics: onboarding-flow\ndecisions:\nstatus: historical\nsupersedes:\ntags:\nsummary:\n---\n# X\n',
    },
    { 'onboarding-flow.md': '# Onboarding flow\n' },
  );
  const dateOf = (rel) => ({
    'wiki/topics/onboarding-flow.md': '2026-09-01T00:00:00Z',
    'wiki/reasoning/2026-09-02-x.md': '2026-09-02T00:00:00Z',
  }[rel] || '');
  const stale = staleHubs(root, traces(root), dateOf);
  assert.equal(stale.length, 1);
  assert.equal(stale[0].slug, 'onboarding-flow');
});

test('report returns one entry per step 0..7 with a state', () => {
  const rows = report(repoRoot, traces(repoRoot));
  assert.deepEqual(rows.map((r) => r.step), [0, 1, 2, 3, 4, 5, 6, 7]);
  for (const row of rows) {
    assert.ok(['DONE', 'PENDING', 'RECURRING'].includes(row.state), `step ${row.step} state`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/wiki-maintenance.test.js`
Expected: FAIL — `Cannot find module '../scripts/wiki-maintenance'`.

- [ ] **Step 3: Write minimal implementation**

Create `scripts/wiki-maintenance.js`:

```js
#!/usr/bin/env node
'use strict';

// Post-release wiki maintenance aid. `status` reports which steps of the wiki
// context-debloat routine are outstanding; `lint` runs the two regression
// checks that keep the routine's invariants from decaying. Authoring-time
// only — never part of the installed Tier 1 payload.

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { traces, render } = require('./build-wiki-index');

const ROOT = path.join(__dirname, '..');

// Traces dated on or after this floor must carry `status:` and `topics:`.
// Older traces predate the frontmatter contract and are handled by the
// generator's historical fallback (wiki/reasoning/README.md). Step 6 of the
// routine sets this to the date the lint lands.
const FRONTMATTER_FLOOR = '2026-09-02';

const SHIPPED_SIGNAL = /close-?out|\b(shipped|landed|merged|closed)\b/i;

function gitDate(root, rel) {
  const out = spawnSync('git', ['log', '-1', '--format=%cI', '--', rel], {
    cwd: root,
    encoding: 'utf8',
  });
  return out.status === 0 ? out.stdout.trim() : '';
}

function frontmatterBlock(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  return match ? match[1] : '';
}

function readWiki(root, rel) {
  return fs.readFileSync(path.join(root, 'wiki', rel), 'utf8');
}

function exists(root, rel) {
  return fs.existsSync(path.join(root, rel));
}

function currentTraces(root, records) {
  return records
    .filter((trace) => trace.status === 'current')
    .map((trace) => ({
      file: trace.file,
      shipped:
        SHIPPED_SIGNAL.test(path.basename(trace.file)) ||
        SHIPPED_SIGNAL.test(readWiki(root, trace.file)),
    }));
}

function untaggedTraces(root) {
  const dir = path.join(root, 'wiki', 'reasoning');
  const rows = [];
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.md') || name === 'README.md') continue;
    const block = frontmatterBlock(fs.readFileSync(path.join(dir, name), 'utf8'));
    const missing = [];
    if (!/^status:/m.test(block)) missing.push('status');
    if (!/^topics:/m.test(block)) missing.push('topics');
    if (missing.length) rows.push({ file: `reasoning/${name}`, missing });
  }
  return rows;
}

function hubSlugs(root) {
  return fs
    .readdirSync(path.join(root, 'wiki', 'topics'))
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''));
}

function staleHubs(root, records, dateOf = (rel) => gitDate(root, rel)) {
  const stale = [];
  for (const slug of hubSlugs(root)) {
    const citing = records.filter((trace) => trace.topics.includes(slug));
    if (!citing.length) continue;
    const hubDate = dateOf(`wiki/topics/${slug}.md`);
    const newestTraceDate = citing
      .map((trace) => dateOf(`wiki/${trace.file}`))
      .filter(Boolean)
      .sort()
      .pop();
    if (hubDate && newestTraceDate && hubDate < newestTraceDate) {
      stale.push({ slug, hubDate, newestTraceDate });
    }
  }
  return stale;
}

function referencedByLiveDoc(root, basename) {
  for (const sub of ['topics', 'tickets']) {
    const dir = path.join(root, 'wiki', sub);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith('.md')) continue;
      if (fs.readFileSync(path.join(dir, name), 'utf8').includes(basename)) {
        return `${sub}/${name}`;
      }
    }
  }
  return '';
}

function baselineInSync(root) {
  for (const [relative, expected] of Object.entries(render(root))) {
    const actual = fs.existsSync(path.join(root, relative))
      ? fs.readFileSync(path.join(root, relative), 'utf8')
      : '';
    if (actual !== expected) return false;
  }
  return true;
}

function ciGuardPresent(root) {
  const guard = path.join(root, 'tests', 'wiki-index.test.js');
  if (!fs.existsSync(guard)) return false;
  const src = fs.readFileSync(guard, 'utf8');
  return src.includes('render(') && src.includes('status.md');
}

function readmeDispositionPresent(root) {
  const readme = path.join(root, 'wiki', 'reasoning', 'README.md');
  if (!fs.existsSync(readme)) return false;
  return /pre-contract|historical fallback/i.test(fs.readFileSync(readme, 'utf8'));
}

function lintsWired(root) {
  const pkg = fs.readFileSync(path.join(root, 'package.json'), 'utf8');
  return pkg.includes('wiki-maintenance.js lint');
}

function tokenInstrumentPresent(root) {
  const dir = path.join(root, 'wiki', 'specs');
  if (!fs.existsSync(dir)) return false;
  return fs
    .readdirSync(dir)
    .some((name) => /token|context-load|read-cost/i.test(name));
}

function report(root, records, dateOf = (rel) => gitDate(root, rel)) {
  const current = currentTraces(root, records);
  const shipped = current.filter((row) => row.shipped);
  const stale = staleHubs(root, records, dateOf);
  const untagged = untaggedTraces(root).map((row) => ({
    ...row,
    referencedBy: referencedByLiveDoc(root, path.basename(row.file)),
  }));
  const untaggedLive = untagged.filter((row) => row.referencedBy);

  const step0Done = baselineInSync(root) && ciGuardPresent(root);
  const step3Done =
    untaggedLive.length === 0 && readmeDispositionPresent(root);
  const step4Done = exists(root, 'wiki/archive');
  const step5Done =
    exists(root, 'wiki/agent-primer.md') &&
    fs.readFileSync(path.join(root, 'CLAUDE.md'), 'utf8').includes('agent-primer');
  const step6Done = lintsWired(root);
  const step7Done = tokenInstrumentPresent(root);

  return [
    {
      step: 0,
      title: 'Baseline + drift guard',
      state: step0Done ? 'DONE' : 'PENDING',
      findings: [
        baselineInSync(root)
          ? 'generated indexes in sync'
          : 'STALE — run node scripts/build-wiki-index.js and re-scope',
        ciGuardPresent(root)
          ? 'CI drift guard present (tests/wiki-index.test.js)'
          : 'CI drift guard missing',
      ],
    },
    {
      step: 1,
      title: 'Lifecycle sweep (current -> historical)',
      state: shipped.length ? 'RECURRING' : 'DONE',
      findings: current.length
        ? current.map(
            (row) =>
              `${row.file} ${row.shipped ? '[shipped-signal]' : '[open?]'}`,
          )
        : ['no status: current traces'],
    },
    {
      step: 2,
      title: 'Sync topic hubs to newest traces',
      state: stale.length ? 'RECURRING' : 'DONE',
      findings: stale.length
        ? stale.map(
            (row) =>
              `${row.slug}: hub ${row.hubDate} older than trace ${row.newestTraceDate}`,
          )
        : ['every hub at least as new as its newest cited trace'],
    },
    {
      step: 3,
      title: 'Disposition for untagged traces',
      state: step3Done ? 'DONE' : 'PENDING',
      findings: [
        `${untagged.length} trace(s) missing status:/topics: (${untaggedLive.length} referenced by a live hub or ticket)`,
        ...untaggedLive.map(
          (row) => `${row.file} <- ${row.referencedBy} (backfill ${row.missing.join('/')})`,
        ),
        readmeDispositionPresent(root)
          ? 'reasoning/README.md records the disposition for the rest'
          : 'reasoning/README.md does not yet record the disposition',
      ],
    },
    {
      step: 4,
      title: 'Archive dead weight',
      state: step4Done ? 'DONE' : 'PENDING',
      findings: [
        step4Done ? 'wiki/archive/ exists' : 'wiki/archive/ not created',
        exists(root, 'wiki/sources/superseded/deprecated-tier-taxonomy')
          ? 'wiki/sources/superseded/deprecated-tier-taxonomy still in place'
          : 'deprecated-tier-taxonomy already moved',
      ],
    },
    {
      step: 5,
      title: 'Single primer page (higher risk; human review)',
      state: step5Done ? 'DONE' : 'PENDING',
      findings: [
        step5Done
          ? 'wiki/agent-primer.md exists and CLAUDE.md cites it'
          : 'no wiki/agent-primer.md wired into CLAUDE.md — start only after steps 1-4 merged',
      ],
    },
    {
      step: 6,
      title: 'Lints so it does not recur',
      state: step6Done ? 'DONE' : 'PENDING',
      findings: [
        step6Done
          ? 'node scripts/wiki-maintenance.js lint is wired into package.json'
          : 'lint not wired into npm test',
      ],
    },
    {
      step: 7,
      title: 'Instrument the token load (optional)',
      state: step7Done ? 'DONE' : 'PENDING',
      findings: [
        step7Done
          ? 'a wiki read-cost measurement exists under wiki/specs/'
          : 'no token/context-load measurement under wiki/specs/ (optional)',
      ],
    },
  ];
}

function formatReport(rows) {
  const lines = ['Wiki maintenance status', ''];
  for (const row of rows) {
    lines.push(`STEP ${row.step} [${row.state}] — ${row.title}`);
    for (const finding of row.findings) lines.push(`  - ${finding}`);
    lines.push('');
  }
  const outstanding = rows.filter((row) => row.state !== 'DONE');
  lines.push(
    outstanding.length
      ? `Outstanding: steps ${outstanding.map((row) => row.step).join(', ')}`
      : 'Nothing outstanding.',
  );
  return `${lines.join('\n')}\n`;
}

function lintFindings() {
  throw new Error('lintFindings is implemented in Task 2');
}

function main(argv) {
  const mode = argv[2] || 'status';
  const records = traces(ROOT);
  if (mode === 'status') {
    process.stdout.write(formatReport(report(ROOT, records)));
    return 0;
  }
  if (mode === 'lint') {
    const failures = lintFindings(ROOT, records);
    for (const failure of failures) console.error(failure);
    console.log(
      failures.length
        ? `wiki-maintenance lint: ${failures.length} failure(s)`
        : 'wiki-maintenance lint: clean',
    );
    return failures.length ? 1 : 0;
  }
  console.error(`unknown mode: ${mode} (use "status" or "lint")`);
  return 2;
}

if (require.main === module) process.exit(main(process.argv));

module.exports = {
  FRONTMATTER_FLOOR,
  gitDate,
  currentTraces,
  untaggedTraces,
  staleHubs,
  referencedByLiveDoc,
  report,
  formatReport,
  lintFindings,
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/wiki-maintenance.test.js`
Expected: PASS — 4 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/wiki-maintenance.js tests/wiki-maintenance.test.js
git commit -m "feat(wiki): add wiki-maintenance status report"
```

---

### Task 2: `lint` mode — hub-freshness + frontmatter-completeness

**Files:**
- Modify: `scripts/wiki-maintenance.js` (replace the `lintFindings` stub, keep everything else)
- Test: `tests/wiki-maintenance.test.js` (append)

**Interfaces:**
- Consumes: `staleHubs`, `untaggedTraces`, `FRONTMATTER_FLOOR` from Task 1.
- Produces: `lintFindings(root, records, dateOf)` → `string[]` (empty = clean). CLI `lint` mode exits `1` when non-empty.

- [ ] **Step 1: Write the failing test**

Append to `tests/wiki-maintenance.test.js`:

```js
const { lintFindings } = require('../scripts/wiki-maintenance');

test('lintFindings fails on a stale hub', () => {
  const root = fixture(
    {
      '2026-09-03-y.md':
        '---\ndate: 2026-09-03\nsource: agent\ntopics: graft-mechanics\ndecisions:\nstatus: historical\nsupersedes:\ntags:\nsummary:\n---\n# Y\n',
    },
    { 'graft-mechanics.md': '# Graft mechanics\n' },
  );
  const dateOf = (rel) => ({
    'wiki/topics/graft-mechanics.md': '2026-09-01T00:00:00Z',
    'wiki/reasoning/2026-09-03-y.md': '2026-09-03T00:00:00Z',
  }[rel] || '');
  const failures = lintFindings(root, traces(root), dateOf);
  assert.equal(failures.length, 1);
  assert.match(failures[0], /graft-mechanics/);
});

test('lintFindings fails on a post-floor trace missing frontmatter but ignores older ones', () => {
  const root = fixture({
    '2020-01-01-ancient.md': '---\ndate: 2020-01-01\nsource: agent\n---\n# Ancient\n',
    '2999-01-01-future-untagged.md': '---\ndate: 2999-01-01\nsource: agent\n---\n# Future\n',
  });
  const dateOf = () => '';
  const failures = lintFindings(root, traces(root), dateOf);
  assert.equal(failures.length, 1);
  assert.match(failures[0], /2999-01-01-future-untagged\.md/);
});

test('lintFindings is clean when hubs are fresh and traces are tagged', () => {
  const root = fixture({
    '2026-09-02-ok.md':
      '---\ndate: 2026-09-02\nsource: agent\ntopics: safety\ndecisions:\nstatus: historical\nsupersedes:\ntags:\nsummary:\n---\n# OK\n',
  });
  assert.deepEqual(lintFindings(root, traces(root), () => ''), []);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/wiki-maintenance.test.js`
Expected: FAIL — `lintFindings is implemented in Task 2` thrown by the three new tests.

- [ ] **Step 3: Write minimal implementation**

In `scripts/wiki-maintenance.js`, replace the `lintFindings` stub with:

```js
function lintFindings(root, records, dateOf = (rel) => gitDate(root, rel)) {
  const failures = [];
  for (const hub of staleHubs(root, records, dateOf)) {
    failures.push(
      `hub wiki/topics/${hub.slug}.md (last change ${hub.hubDate}) is older than its newest cited trace (${hub.newestTraceDate})`,
    );
  }
  for (const trace of untaggedTraces(root)) {
    const traceDate = path.basename(trace.file).slice(0, 10);
    if (traceDate >= FRONTMATTER_FLOOR) {
      failures.push(
        `${trace.file} is dated on/after ${FRONTMATTER_FLOOR} but is missing frontmatter: ${trace.missing.join(', ')}`,
      );
    }
  }
  return failures;
}
```

Leave the `module.exports` block unchanged (it already exports `lintFindings`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/wiki-maintenance.test.js`
Expected: PASS — 7 tests.

Run: `node scripts/wiki-maintenance.js lint`
Expected: exit `0`, prints `wiki-maintenance lint: clean` OR lists real stale hubs on the current branch (that is a true finding, not a plan failure — note it in the PR description; do not fix hubs here).

- [ ] **Step 5: Commit**

```bash
git add scripts/wiki-maintenance.js tests/wiki-maintenance.test.js
git commit -m "feat(wiki): add wiki-maintenance lint checks"
```

---

### Task 3: `.claude/skills/wiki-maintenance/SKILL.md`

**Files:**
- Create: `.claude/skills/wiki-maintenance/SKILL.md`
- Test: `tests/wiki-maintenance-skill.test.js`

**Interfaces:**
- Consumes: nothing at runtime. References `scripts/wiki-maintenance.js` and `scripts/build-wiki-index.js` in prose.
- Produces: a discoverable Claude Code skill named `wiki-maintenance`.

- [ ] **Step 1: Write the failing test**

Create `tests/wiki-maintenance-skill.test.js`:

```js
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const skill = fs.readFileSync(
  path.join(__dirname, '..', '.claude', 'skills', 'wiki-maintenance', 'SKILL.md'),
  'utf8',
);

test('skill has name and description frontmatter', () => {
  assert.match(skill, /^---\n[\s\S]*?\nname: wiki-maintenance\n[\s\S]*?\ndescription: .+\n[\s\S]*?\n---\n/);
});

test('skill documents every step 0 through 7', () => {
  for (let step = 0; step <= 7; step += 1) {
    assert.match(skill, new RegExp(`## Step ${step} —`), `missing Step ${step}`);
  }
});

test('skill references the backing script and the generator', () => {
  assert.match(skill, /scripts\/wiki-maintenance\.js status/);
  assert.match(skill, /scripts\/wiki-maintenance\.js lint/);
  assert.match(skill, /scripts\/build-wiki-index\.js/);
});

test('skill has ground rules and a scheduling section', () => {
  assert.match(skill, /## Ground rules/);
  assert.match(skill, /## Scheduling/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/wiki-maintenance-skill.test.js`
Expected: FAIL — `ENOENT` reading `SKILL.md`.

- [ ] **Step 3: Write the skill**

Create `.claude/skills/wiki-maintenance/SKILL.md` with exactly this content:

```markdown
---
name: wiki-maintenance
description: Run after a major release (or on a schedule) to keep wiki/ synced with the branch and its context cost bounded — lifecycle sweep, hub sync, reindex, archive, and the one-time context-management infrastructure. Authoring-time only; not part of the installed Tier 1 payload.
---

# Wiki maintenance (post-release routine)

Keeps the project wiki synced with the branch and its read cost bounded.
Steps 1–3 recur every release; steps 0 and 4–7 are one-time infrastructure
that self-skip once in place.

Source of the routine: `.context/wiki-sync-and-context-debloat-research-brief.md`
and its execution plan.

## When to run

- After every major release / merge to `prod`.
- Any time `node scripts/wiki-maintenance.js status` reports outstanding steps.

## How to run

1. `node scripts/wiki-maintenance.js status` — prints each step as
   `DONE` / `PENDING` / `RECURRING` with the specifics you need.
2. Work only the steps it marks `PENDING` or `RECURRING`, in number order.
3. One step per commit/PR. `npm test` green before every push.
4. Stop and flag any judgment call the ground rules below do not resolve —
   a note in the step's trace or the PR description. Never guess silently.

## Ground rules (apply to every step)

1. Never edit the body of `wiki/reasoning/*` or `wiki/sources/*`. You may
   `git mv` a file or change its frontmatter fields (`status:`, `topics:`);
   you may never rewrite its content.
2. Never hand-edit `wiki/status.md` or `wiki/index/reasoning.md`. They change
   only by editing trace frontmatter and rerunning
   `node scripts/build-wiki-index.js`.
3. `wiki/gate1/` and `wiki/gate2/` are off-limits — no edits, trims, or
   restructuring, even if a file looks bloated.
4. New automation is authoring-time only, under `scripts/`. Nothing in
   `rig/tier-1/` may depend on it — Tier 1 stays markdown-only in the
   installed payload.
5. `CLAUDE.md`, `rig/tier-1/routing.md`, and `wiki/reasoning/README.md`
   describe one read/write cadence. A step that changes that cadence updates
   all three in the same commit.
6. Every step that changes what's true in the wiki is a full-cadence change:
   file a dated `wiki/reasoning/` trace for the step, update every hub/index
   it touches, rerun `node scripts/build-wiki-index.js`, confirm `npm test`
   is green, then push.
7. On any ambiguous judgment call not covered above, stop and flag it rather
   than picking a side.

## Step 0 — Baseline + drift guard

**Skip if:** `status` reports "generated indexes in sync" AND "CI drift guard
present".

**Do:** run `node scripts/build-wiki-index.js`, then `git diff --stat`.
Expect no diff. If there is one, stop — the wiki changed since the last run
and steps 1+ must be re-scoped against the new state first. If `status`
reports the CI drift guard missing, add a check that runs the generator and
fails on any diff (today `tests/wiki-index.test.js` is that guard).

**Done when:** the generator produces no diff and a test fails on drift.

## Step 1 — Lifecycle sweep (recurring)

**Skip if:** `status` lists no `status: current` trace carrying a
`[shipped-signal]` flag.

**Do:** for each trace `status` lists under Step 1, open it. Flip
`status: current` → `status: historical` in its frontmatter if and only if
the filename contains "close-out", OR the body states the related
ticket/feature has shipped, landed, or merged. Leave it `current` if it
describes work still open. If you cannot tell from the body alone, leave it
`current` and add `<!-- needs-human-review: status -->` beside the
frontmatter instead of guessing. Then run
`node scripts/build-wiki-index.js` and check `wiki/status.md`.

**Done when:** `status.md`'s bullet count has dropped and every remaining
bullet is a trace with no close-out signal in its body.

## Step 2 — Sync topic hubs to newest traces (recurring)

**Skip if:** `status` lists no stale hubs.

**Do:** for each hub `status` flags stale (its last commit predates its
newest cited trace), find the traces listing it in `topics:` sorted newest
first, and confirm the hub's synthesis reflects the newest trace's
decisions. If it does not, update the hub's prose — cite the trace by
date/filename, do not quote it verbatim (this is synthesis). If any decision
ID changed as a result, update `wiki/index/decisions.md` in the same commit.

**Done when:** every hub's most recent edit is at least as new as the newest
trace that lists it in `topics:`, or `status` confirms each flagged hub was
already current.

## Step 3 — Disposition for untagged traces

**Skip if:** `status` reports no untagged trace referenced by a live hub or
open ticket, AND that `reasoning/README.md` records the disposition.

**Do:** do not run a blanket migration. For each untagged trace `status`
marks as referenced by a hub or ticket, backfill its `status:` and `topics:`
frontmatter from its actual content. For everything else, leave it alone and
add one paragraph to `wiki/reasoning/README.md` stating that untagged
pre-contract traces are intentionally left to the generator's historical
fallback and are discoverable by date/filename only.

**Done when:** no live hub or open ticket points at a trace with missing
frontmatter, and `reasoning/README.md` states the disposition for the rest.

## Step 4 — Archive dead weight

**Skip if:** `wiki/archive/` exists.

**Do:** create `wiki/archive/` and note the addition in `wiki/Home.md` (it is
a sixth location, outside the five-page-kind model). Move, using `git mv`
(relocation, never rewrite):
`wiki/sources/superseded/deprecated-tier-taxonomy/` → `wiki/archive/`, and
`wiki/reasoning/2026-08-30-status-before-generated-summary.md` →
`wiki/archive/`. Keep `wiki/archive/` out of `wiki/Home.md` primary
navigation and out of the `CLAUDE.md` "read the wiki before you grep"
mandate. File one dated trace recording the move and its reason (the
taxonomy is dead; the status snapshot is fully superseded by the generator).

**Done when:** both paths are relocated, `Home.md` does not link
`wiki/archive/` from primary navigation, and the move trace exists.

## Step 5 — Single primer page (higher risk; human review)

**Skip if:** `wiki/agent-primer.md` exists and `CLAUDE.md` cites it.

**Only start after steps 1–4 are merged and `npm test` is green on each.**
This step changes the agent's core read contract.

**Do:** design `wiki/agent-primer.md` — one short generated page linking
`Home.md`, `status.md`, and the hubs/indexes relevant to routing decisions —
as a single mandated read that replaces the current "read Home.md +
status.md + hubs before grepping" instruction. Point `CLAUDE.md`'s
read-before-grep mandate at `wiki/agent-primer.md`. Update
`rig/tier-1/routing.md` and `wiki/reasoning/README.md` to describe the same
cadence — all three must agree. Do not remove the task-weight carve-out in
`routing.md`. Flag the PR for explicit human review before merge even if
`npm test` passes.

**Done when:** `CLAUDE.md`, `routing.md`, and `reasoning/README.md` all
describe the primer-based cadence consistently, and a human has reviewed the
change.

## Step 6 — Lints so this does not recur

**Skip if:** `status` reports the lints wired into `npm test`.

**Do:** wire `node scripts/wiki-maintenance.js lint` into the `test:code`
chain in `package.json`. It runs two checks and exits non-zero on failure:
a hub-freshness check (a hub older than its newest cited trace fails), and a
frontmatter-completeness check for new traces. Set the `FRONTMATTER_FLOOR`
constant in `scripts/wiki-maintenance.js` to the date this step lands — the
completeness check applies only to traces dated on/after it, never
retroactively.

**Done when:** `node scripts/wiki-maintenance.js lint` runs as part of
`npm test` and passes on `prod`.

## Step 7 — Instrument the token load (optional)

**Skip if:** a baseline line/token measurement of the pre-grep wiki read
exists under `wiki/specs/`.

**Do:** following `wiki/specs/adaptation-measurement-rubric.md`, add a
lightweight measurement of how much wiki content a task pulls before its
first code edit. Capture one baseline before Step 5 merges and one after, so
Step 5 has a before/after number instead of a felt sense of "lighter".

**Done when:** a baseline measurement from before Step 5 and a second
measurement from after both exist.

## Scheduling

This routine is safe to defer or repeat — every step self-skips once
satisfied, and the `status` probe is read-only.

- **Run later, once:** `/schedule` a one-time run that invokes this skill.
- **Recurring:** `/schedule` a cron tied to your release cadence, or `/loop`
  on an interval, pointed at this skill. A recurring run will normally find
  only steps 1–3 outstanding; steps 0 and 4–7 stay `DONE`.
- Whoever runs it still follows the ground rules: one step per PR, `npm test`
  green before push, stop and flag judgment calls.

## Commit / PR hygiene

- One step, one PR.
- Every PR that touches wiki content includes the dated trace for that step,
  any hub/index updates it required, and a clean rerun of
  `node scripts/build-wiki-index.js`.
- `npm test` green before any push.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/wiki-maintenance-skill.test.js`
Expected: PASS — 4 tests.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/wiki-maintenance/SKILL.md tests/wiki-maintenance-skill.test.js
git commit -m "feat(wiki): add wiki-maintenance skill"
```

---

### Task 4: Provenance trace, hub pointer, regen, memory

**Files:**
- Create: `wiki/reasoning/2026-09-02-wiki-maintenance-skill.md`
- Modify: `wiki/topics/agent-working-conventions.md` (append one paragraph under "Current implementation")
- Modify (generated): `wiki/status.md`, `wiki/index/reasoning.md` (via the generator — do not hand-edit)
- Modify: `/Users/winmore/.claude/projects/-Users-winmore-conductor-repos-rig-v0-1/memory/MEMORY.md` and a new memory file (agent action, outside the repo)

**Interfaces:**
- Consumes: nothing.
- Produces: the immutable record that the routine is now a skill, plus the two deferred ideas.

- [ ] **Step 1: Write the reasoning trace**

Create `wiki/reasoning/2026-09-02-wiki-maintenance-skill.md` with exactly:

```markdown
---
date: 2026-09-02
source: agent
topics: agent-working-conventions
decisions:
status: historical
supersedes:
tags:
summary:
---

# The wiki context-debloat routine is now a skill

The seven-step wiki sync + context-debloat routine — captured in
`.context/wiki-sync-and-context-debloat-research-brief.md` and its execution
plan — is packaged as the `wiki-maintenance` skill at
`.claude/skills/wiki-maintenance/SKILL.md`, backed by
`scripts/wiki-maintenance.js` (`status` readiness report + `lint` checks that
reuse `scripts/build-wiki-index.js`).

Steps 1–3 (lifecycle sweep, hub sync, untagged-trace disposition) recur every
release. Steps 0 and 4–7 (drift guard, archive, primer page, lints, token
instrument) are one-time infrastructure whose "Skip if" markers make repeated
runs idempotent. The skill is authoring-time only and is not part of the
installed Tier 1 payload: `.claude/skills/wiki-maintenance/` sits outside the
`.claude/skills/rig-*` install and gitignore globs.

Run it after a major release, or on a schedule via `/schedule` or `/loop` —
`node scripts/wiki-maintenance.js status` is read-only and every step
self-skips once satisfied.

This change adds tooling and a skill document; it does not execute any of the
seven steps and does not wire the lint into `npm test`. Step 6 of the routine
owns that wiring under its own trace.

## Deferred ideas (recorded, not scheduled)

- Ship the debloating + context-management routine as a first-class Rig
  capability that other repositories install, rather than a Rig-repo-local
  maintenance skill.
- Survey how the Claude "superpowers" skills could be delivered to every
  supported host (Codex, Antigravity, and the rest) rather than native
  Claude only — a host-neutral path for skill payloads.
```

- [ ] **Step 2: Append the hub pointer**

In `wiki/topics/agent-working-conventions.md`, under the `## Current implementation` section, add this paragraph at the end of that section:

```markdown
The post-release wiki upkeep routine — lifecycle sweep, hub sync, reindex,
archive, and the one-time context-management infrastructure — is packaged as
the `wiki-maintenance` skill at `.claude/skills/wiki-maintenance/SKILL.md`,
backed by `scripts/wiki-maintenance.js`. It is authoring-time only and not
installed into other repositories.
[2026-09-02 trace](../reasoning/2026-09-02-wiki-maintenance-skill.md)
```

- [ ] **Step 3: Regenerate the wiki indexes**

Run: `node scripts/build-wiki-index.js`
Then: `git diff --stat wiki/status.md wiki/index/reasoning.md`
Expected: `wiki/index/reasoning.md` gains one row for the new trace; `wiki/status.md` is unchanged (the trace is `historical`). If `status.md` changed, something else drifted — stop and investigate before committing.

- [ ] **Step 4: Run the full gate**

Run: `npm test`
Expected: exit `0`. In particular `tests/wiki-index.test.js` (committed generated files match), `tests/wiki-maintenance.test.js`, and `tests/wiki-maintenance-skill.test.js` all pass.

- [ ] **Step 5: Commit**

```bash
git add wiki/reasoning/2026-09-02-wiki-maintenance-skill.md wiki/topics/agent-working-conventions.md wiki/status.md wiki/index/reasoning.md
git commit -m "docs(wiki): record wiki-maintenance skill and deferred ideas"
```

- [ ] **Step 6: Save the deferred ideas to memory**

Create `/Users/winmore/.claude/projects/-Users-winmore-conductor-repos-rig-v0-1/memory/project_wiki_maintenance_skill_and_deferred.md`:

```markdown
---
name: project-wiki-maintenance-skill-and-deferred
description: The post-release wiki upkeep routine is the wiki-maintenance skill; two related ideas are deferred.
metadata:
  type: project
---

The seven-step wiki sync + context-debloat routine is packaged as the
`wiki-maintenance` skill (`.claude/skills/wiki-maintenance/SKILL.md` +
`scripts/wiki-maintenance.js`, `status` and `lint` modes). Run after major
releases or on a schedule; steps self-skip once satisfied.

**Deferred (recorded 2026-09-02, not scheduled):**
- Ship debloating + context management as a first-class Rig feature other
  repos install.
- Survey delivering Claude "superpowers" skills to all hosts (Codex,
  Antigravity, …), not native Claude only.

Provenance: `wiki/reasoning/2026-09-02-wiki-maintenance-skill.md`.
```

Then append to `/Users/winmore/.claude/projects/-Users-winmore-conductor-repos-rig-v0-1/memory/MEMORY.md`:

```markdown
- [Wiki maintenance skill + deferred ideas](project_wiki_maintenance_skill_and_deferred.md) — post-release wiki upkeep is now a skill; two related ideas parked.
```

(No commit — the memory directory is outside the repo.)

---

## Out of scope (deferred or explicitly not done here)

- **Executing the seven steps.** This plan delivers the skill and script; running the routine is a separate effort the skill itself governs.
- **Wiring `wiki-maintenance.js lint` into `npm test`.** That is Step 6 of the routine, performed later under its own provenance trace. Until then the lint is exercised only by `tests/wiki-maintenance.test.js`.
- **Mirroring the skill into `.agents/skills/` for Codex/Antigravity.** Not done; the second deferred idea (host-neutral skill delivery) covers this ground.
- **Deferred ideas** (recorded in the Task 4 trace and memory, not acted on): ship debloating + context management as a first-class Rig feature; survey delivering the Claude superpowers skills to all hosts.

## Self-Review

**Spec coverage** (against the design approved in chat):
- Skill at `.claude/skills/wiki-maintenance/SKILL.md`, all 7 steps as Skip-if / Do / Done-when → Task 3. ✓
- `scripts/wiki-maintenance.js` with `status` (readiness report driving "already done?" gates) and `lint` → Tasks 1, 2. ✓
- Reuses `build-wiki-index.js` exports → `require('./build-wiki-index')` in Task 1. ✓
- Scheduling section (defer + recurring, idempotency rationale) → Task 3 `## Scheduling`. ✓
- Provenance trace + hub pointer + regen → Task 4. ✓
- Deferred ideas recorded, not acted on → Task 4 trace + memory, Out of scope. ✓
- Choice B (all 7 steps, self-aware) → `report()` emits every step with DONE/PENDING/RECURRING; SKILL.md carries all 7. ✓

**Placeholder scan:** `lintFindings` is a deliberate labelled stub in Task 1 (`throw new Error('lintFindings is implemented in Task 2')`), replaced with real code in Task 2 Step 3 — not a placeholder in the finished tree. All other code blocks are complete. No "TBD"/"handle edge cases"/"similar to Task N".

**Type consistency:** `report`, `currentTraces`, `untaggedTraces`, `staleHubs`, `lintFindings` all take `(root, ...)` with `dateOf` last and defaulting to `(rel) => gitDate(root, rel)`; `records` is `traces(root)` everywhere; `staleHubs` entries use `{ slug, hubDate, newestTraceDate }` in both Task 1 and Task 2; the `module.exports` block in Task 1 already lists `lintFindings`, so Task 2 changes nothing there. Consistent.

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-09-02-wiki-maintenance-skill.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
