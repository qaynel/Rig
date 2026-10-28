'use strict';

// Pre-implementation audit of the work-package plan. A package is runnable only
// when no problem blocks it and every dependency is complete, so one contested
// or unproven package holds back everything that depends on it.

const fs = require('node:fs');
const path = require('node:path');
const { containedPath } = require('../../lib/path-safety');
const { ownershipKey, overlaps } = require('./workers');

function readPlan(file, problems) {
  let plan;
  try {
    plan = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    problems.push(`${file} is not readable JSON: ${err.message}`);
    return [];
  }
  if (!Array.isArray(plan?.packages)) {
    problems.push('work package plan has no packages array');
    return [];
  }
  return plan.packages;
}

// Dependencies first, stable by input order. A cycle is reported with its
// members and still emitted, so the output always covers every package.
function topoOrder(pkgs, known, flag) {
  const state = new Map();
  const stack = [];
  const out = [];
  const visit = (id) => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'visiting') {
      const cycle = stack.slice(stack.indexOf(id)).concat(id);
      flag(cycle, `dependency cycle: ${cycle.join(' -> ')}`);
      return;
    }
    state.set(id, 'visiting');
    stack.push(id);
    for (const dep of known.get(id).depends) if (known.has(dep)) visit(dep);
    stack.pop();
    state.set(id, 'done');
    out.push(id);
  };
  for (const e of pkgs) visit(e.id);
  return out;
}

function audit(repo, { file, approved = [], persist = true } = {}) {
  const problems = [];
  const blocked = new Set();
  const flag = (ids, msg) => {
    problems.push(msg);
    ids.forEach((id) => blocked.add(id));
  };

  const approvedSet = new Set(approved);
  const known = new Map();
  const pkgs = [];
  let planPath;
  try { planPath = containedPath(repo, file); }
  catch (error) { return { order: [], runnable: [], problems: [error.message] }; }
  readPlan(planPath, problems).forEach((p, i) => {
    const id = typeof p?.id === 'string' && p.id ? p.id : `package #${i + 1}`;
    if (!p || typeof p.id !== 'string' || !p.id) flag([id], `${id} has no id`);
    if (known.has(id)) {
      flag([id], `duplicate package id ${id}`);
      return;
    }
    const entry = {
      id,
      depends: Array.isArray(p.depends) ? p.depends : [],
      owns: [],
    };
    for (const owned of Array.isArray(p?.owns) ? p.owns : []) {
      try { entry.owns.push(ownershipKey(repo, owned)); }
      catch (error) { flag([id], `${id} invalid ownership path ${String(owned)}: ${error.message}`); }
    }
    known.set(id, entry);
    pkgs.push(entry);

    if (typeof p.outcome !== 'string' || !p.outcome.trim()) flag([id], `${id} has no outcome`);
    if (entry.owns.length === 0) flag([id], `${id} owns no paths`);
    if (!Array.isArray(p.requirements) || p.requirements.length === 0) flag([id], `${id} maps to no requirements`);
    for (const r of Array.isArray(p.requirements) ? p.requirements : []) {
      if (!approvedSet.has(r)) flag([id], `${id} maps to unapproved requirement ${r} (orphaned acceptance mapping)`);
    }
    if (!Array.isArray(p.exit) || p.exit.length === 0) flag([id], `${id} has no exit evidence`);
  });

  const owners = new Map();
  for (const e of pkgs) {
    for (const f of new Set(e.owns)) {
      const prior = [...owners].filter(([held]) => overlaps(held, f)).flatMap(([, ids]) => ids);
      for (const other of prior) {
        const [a, b] = [other, e.id].sort();
        flag([a, b], `${a} and ${b} both own ${f}`);
      }
      owners.set(f, (owners.get(f) || []).concat(e.id));
    }
  }

  for (const e of pkgs) {
    for (const d of e.depends) {
      if (!known.has(d)) flag([e.id], `${e.id} depends on unknown package ${d}`);
    }
  }

  const sorted = topoOrder(pkgs, known, flag);
  const workers = require('./workers');
  const release = require('./release-evidence');
  const digest = release.sourceDigest(repo);
  const accepted = pkgs.filter(({ id }) => { const state = workers.state(repo, id); return state.status === 'accepted' && state.candidate_digest === digest; });
  const integrated = release.integrationStatus(repo).valid;
  const complete = new Set(accepted.map(({ id }) => id));
  const provisional = integrated ? [] : accepted.map(({ id }) => id);
  const runnable = sorted.filter((id) => !complete.has(id) && !blocked.has(id) && known.get(id).depends.every((d) => complete.has(d)));

  const result = { order: sorted, runnable, provisional, problems };
  if (persist) {
    fs.mkdirSync(path.join(repo, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(repo, '.rig', 'work-packages-audit.json'), `${JSON.stringify(result, null, 2)}\n`);
  }
  return result;
}

module.exports = { audit };
