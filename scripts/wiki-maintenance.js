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
