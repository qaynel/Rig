#!/usr/bin/env node
'use strict';

// Deterministic requirement -> primary acceptance criterion -> proving test ->
// journey/package validator. Rig's permanent one-to-one traceability invariant:
// every independently testable requirement has exactly one same-numbered
// primary criterion and one same-numbered proving test, every criterion names a
// fixture, and every journey and work package resolves to approved requirement
// IDs. Reads the authored contract tables directly so there is no second copy
// of the graph to drift from the bytes the owner signs.
//
// Usage: check-traceability.js [--dir <contract-dir>] [--json] [--hashes <file>]
// Exits 0 when the graph is complete, 1 with the exact offending IDs otherwise.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DASH = /[‐-―-]/;            // hyphen or any unicode dash in a range
const ID = {
  requirement: /^R(\d{3})\b/,
  journey: /^J(\d{2})$/,
  fixture: /^F(\d{2})$/,
  package: /^\*\*WP(\d{2})\b/,
};

function resolveDir(argDir) {
  const candidates = [
    argDir,
    process.env.RIG_CONTRACT_DIR,
    '.rig/contract',
    'wiki/specs/ai-sdlc-harness',
  ].filter(Boolean);
  for (const c of candidates) if (fs.existsSync(c) && fs.statSync(c).isDirectory()) return c;
  throw new Error(`no contract directory found (looked at ${candidates.join(', ')})`);
}

// Pipe-table rows only; the separator row and prose are ignored.
function rows(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir).sort()) {
    if (!name.endsWith('.md')) continue;
    const file = path.join(dir, name);
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      const t = line.trim();
      if (!t.startsWith('|') || !t.endsWith('|')) return;
      const cells = t.slice(1, -1).split('|').map((c) => c.trim());
      if (cells.length < 3 || cells.every((c) => /^-*:?-*$/.test(c))) return;
      out.push({ cells, file: name, line: i + 1 });
    });
  }
  return out;
}

// "R006–R024" / "PT-006-PT-024" expand; bare "R052" stays single.
function expandIds(cell, prefix) {
  const found = new Set();
  const atom = new RegExp(`${prefix}-?(\\d{2,3})`, 'g');
  for (const part of cell.split(',')) {
    const nums = [...part.matchAll(atom)].map((m) => m[1]);
    const isRange = nums.length === 2 && DASH.test(part.replace(atom, ''));
    if (isRange) {
      const width = nums[0].length;
      for (let n = Number(nums[0]); n <= Number(nums[1]); n++) found.add(String(n).padStart(width, '0'));
    } else for (const n of nums) found.add(n);
  }
  return [...found];
}

function parse(dir) {
  const graph = { requirements: new Map(), journeys: new Map(), fixtures: new Map(), packages: new Map(), duplicates: [] };
  for (const row of rows(dir)) {
    const head = row.cells[0];
    const add = (map, key, value) => {
      if (map.has(key)) graph.duplicates.push(`${key} (${map.get(key).file}:${map.get(key).line} and ${row.file}:${row.line})`);
      else map.set(key, value);
    };
    let m;
    if ((m = ID.requirement.exec(head)) && row.cells.length >= 7) {
      const [source, obligation, criterion, test, journey, depends, status] = row.cells;
      add(graph.requirements, `R${m[1]}`, {
        id: `R${m[1]}`, num: m[1], file: row.file, line: row.line,
        sources: [...source.matchAll(/\b(?:F\d{2}|N\d{2}|O\d{2}S?)\b/g)].map((x) => x[0]),
        obligation,
        criteria: [...criterion.matchAll(/AC-(\d{3})/g)].map((x) => x[1]),
        tests: [...test.matchAll(/PT-(\d{3})/g)].map((x) => x[1]),
        fixtures: [...test.matchAll(/\bF(\d{2})\b/g)].map((x) => x[1]),
        journeys: [...journey.matchAll(/\bJ(\d{2})\b/g)].map((x) => x[1]),
        depends: [...depends.matchAll(/\bR(\d{3})\b/g)].map((x) => x[0]),
        status,
      });
    } else if ((m = ID.journey.exec(head)) && row.cells.length >= 4) {
      add(graph.journeys, `J${m[1]}`, {
        id: `J${m[1]}`, file: row.file, line: row.line, scenario: row.cells[1],
        requirements: expandIds(row.cells[2], 'R'),
        e2e: /E2E-J\d{2}/.test(row.cells[3]) ? row.cells[3].match(/E2E-J\d{2}/)[0] : null,
      });
    } else if ((m = ID.fixture.exec(head)) && row.cells.length >= 3) {
      add(graph.fixtures, `F${m[1]}`, { id: `F${m[1]}`, file: row.file, line: row.line, setup: row.cells[1], home: row.cells[2] });
    } else if ((m = ID.package.exec(head)) && row.cells.length >= 4) {
      add(graph.packages, `WP${m[1]}`, {
        id: `WP${m[1]}`, file: row.file, line: row.line,
        requirements: expandIds(row.cells[1], 'R'),
        tests: expandIds(row.cells[3], 'PT'),
      });
    }
  }
  return graph;
}

function validate(graph) {
  const errors = [];
  const { requirements, journeys, fixtures, packages } = graph;
  for (const d of graph.duplicates) errors.push(`duplicate ID ${d}`);

  const criterionOwner = new Map();
  const testOwner = new Map();

  for (const r of requirements.values()) {
    if (!r.sources.length) errors.push(`${r.id} has no source reference`);
    if (!r.obligation) errors.push(`${r.id} has no obligation text`);

    if (r.criteria.length === 0) errors.push(`${r.id} has no primary acceptance criterion`);
    else if (r.criteria.length > 1) errors.push(`${r.id} has ${r.criteria.length} primary criteria (AC-${r.criteria.join(', AC-')}); exactly one is allowed`);
    else if (r.criteria[0] !== r.num) errors.push(`${r.id} primary criterion is AC-${r.criteria[0]}; the one-to-one mapping requires AC-${r.num}`);

    if (r.tests.length === 0) errors.push(`AC-${r.num} has no proving test`);
    else if (r.tests.length > 1) errors.push(`AC-${r.num} names ${r.tests.length} primary proving tests; exactly one is allowed`);
    else if (r.tests[0] !== r.num) errors.push(`AC-${r.num} proving test is PT-${r.tests[0]}; the one-to-one mapping requires PT-${r.num}`);

    if (!r.fixtures.length) errors.push(`PT-${r.num} names no fixture`);
    for (const f of r.fixtures) if (!fixtures.has(`F${f}`)) errors.push(`PT-${r.num} references unknown fixture F${f}`);

    if (!r.journeys.length) errors.push(`${r.id} is not connected to a customer journey`);
    for (const j of r.journeys) if (!journeys.has(`J${j}`)) errors.push(`${r.id} references unknown journey J${j}`);

    for (const dep of r.depends) if (!requirements.has(dep)) errors.push(`${r.id} depends on unknown requirement ${dep}`);
    if (r.depends.includes(r.id)) errors.push(`${r.id} depends on itself`);

    for (const c of r.criteria) {
      if (criterionOwner.has(c)) errors.push(`AC-${c} is claimed as primary by both ${criterionOwner.get(c)} and ${r.id}`);
      else criterionOwner.set(c, r.id);
    }
    for (const t of r.tests) {
      if (testOwner.has(t)) errors.push(`PT-${t} is claimed as primary by both ${testOwner.get(t)} and ${r.id}`);
      else testOwner.set(t, r.id);
    }
  }

  for (const j of journeys.values()) {
    if (!j.requirements.length) errors.push(`${j.id} maps no requirement`);
    if (!j.e2e) errors.push(`${j.id} has no end-to-end proving obligation`);
    for (const n of j.requirements) if (!requirements.has(`R${n}`)) errors.push(`${j.id} references unknown requirement R${n}`);
  }

  for (const p of packages.values()) {
    if (!p.requirements.length) errors.push(`${p.id} cites no approved requirement`);
    for (const n of p.requirements) if (!requirements.has(`R${n}`)) errors.push(`${p.id} references unknown requirement R${n}`);
    for (const n of p.tests) if (!testOwner.has(n)) errors.push(`${p.id} references unknown proving test PT-${n}`);
  }

  // Orphans: a declared artefact nothing in the graph reaches.
  for (const f of fixtures.keys()) {
    const used = [...requirements.values()].some((r) => r.fixtures.includes(f.slice(1)));
    if (!used) errors.push(`fixture ${f} is orphaned: no proving test uses it`);
  }
  for (const j of journeys.keys()) {
    const used = [...requirements.values()].some((r) => r.journeys.includes(j.slice(1)));
    if (!used) errors.push(`journey ${j} is orphaned: no requirement maps to it`);
  }
  const covered = new Set([...packages.values()].flatMap((p) => p.requirements));
  for (const r of requirements.values()) if (!covered.has(r.num)) errors.push(`${r.id} is in no work package`);

  return errors;
}

// Protected-byte binding: a requirement change after approval must invalidate
// the approval until the owner amends the whole protected set.
function hashCheck(dir, hashFile) {
  const recorded = JSON.parse(fs.readFileSync(hashFile, 'utf8'));
  const errors = [];
  for (const [rel, want] of Object.entries(recorded.files || recorded)) {
    const abs = path.join(dir, rel);
    if (!fs.existsSync(abs)) { errors.push(`protected file ${rel} is missing`); continue; }
    const got = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
    if (got !== want) errors.push(`protected file ${rel} changed: recorded ${want.slice(0, 12)}, found ${got.slice(0, 12)} — the approval is void until the owner amends the protected set`);
  }
  return errors;
}

function main(argv) {
  const arg = (flag) => { const i = argv.indexOf(flag); return i === -1 ? undefined : argv[i + 1]; };
  const dir = resolveDir(arg('--dir'));
  const graph = parse(dir);
  const errors = validate(graph);
  if (arg('--hashes')) errors.push(...hashCheck(dir, arg('--hashes')));

  const counts = {
    requirements: graph.requirements.size,
    criteria: graph.requirements.size && [...graph.requirements.values()].filter((r) => r.criteria.length === 1).length,
    tests: [...graph.requirements.values()].filter((r) => r.tests.length === 1).length,
    fixtures: graph.fixtures.size,
    journeys: graph.journeys.size,
    packages: graph.packages.size,
  };

  if (argv.includes('--json')) {
    console.log(JSON.stringify({ dir, counts, errors }, null, 2));
  } else if (errors.length) {
    console.error(`traceability: ${errors.length} problem(s) in ${dir}`);
    for (const e of errors) console.error(`  - ${e}`);
  } else {
    console.log(`traceability: ${counts.requirements} requirements, ${counts.criteria} primary criteria, ${counts.tests} proving tests, ${counts.fixtures} fixtures, ${counts.journeys} journeys, ${counts.packages} packages — graph complete`);
  }
  return errors.length ? 1 : 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
module.exports = { parse, validate, hashCheck, resolveDir, expandIds, main };
