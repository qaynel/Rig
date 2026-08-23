// Named-slice dependency resolver (impl-design §4.4, AD-5).
'use strict';

const { servicesOf, GRADES } = require('./catalog');

function serviceMap(catalog) {
  return Object.fromEntries(servicesOf(catalog).map((s) => [s.id, s]));
}

function resolve(catalog, selection) {
  const byId = serviceMap(catalog);
  for (const [id, grade] of Object.entries(selection || {})) {
    if (!byId[id]) throw new Error(`unknown service "${id}"`);
    if (!GRADES.includes(grade)) throw new Error(`invalid grade "${grade}"`);
  }

  /** @type {Record<string, any>} */
  const effective = {};
  for (const [id, grade] of Object.entries(selection || {})) {
    effective[id] = {
      selected_grade: grade,
      grade,
      required_slices: [],
      required_by: [],
      install_reason: 'selected',
    };
  }

  const visiting = new Set();
  const stack = [];

  function ensureEntry(targetId) {
    if (!effective[targetId]) {
      effective[targetId] = {
        selected_grade: null,
        grade: null,
        required_slices: [],
        required_by: [],
        install_reason: 'dependency',
      };
    }
  }

  function addDep(fromId, dep) {
    const targetId = dep.service;
    const slice = dep.slice;
    if (!byId[targetId]) throw new Error(`unknown dependency "${targetId}" from ${fromId}`);
    ensureEntry(targetId);
    if (effective[targetId].install_reason === 'selected') {
      effective[targetId].install_reason = 'selected+dependency';
    }
    if (slice && !effective[targetId].required_slices.includes(slice)) {
      effective[targetId].required_slices.push(slice);
      effective[targetId].required_slices.sort();
    }
    if (!effective[targetId].required_by.includes(fromId)) {
      effective[targetId].required_by.push(fromId);
      effective[targetId].required_by.sort();
    }
    walk(targetId);
  }

  function requirementsFor(id) {
    const service = byId[id];
    const entry = effective[id];
    if (entry.selected_grade) {
      const grades = GRADES.slice(0, GRADES.indexOf(entry.selected_grade) + 1);
      return grades.flatMap((grade) => service.requires?.[grade] || []);
    }
    if (entry.required_slices.length) {
      return entry.required_slices.flatMap((slice) => service.slices?.[slice]?.requires || []);
    }
    return service.requires?.minimal || [];
  }

  function walk(id) {
    if (visiting.has(id)) {
      throw new Error(`cycle: ${[...stack, id].join(' -> ')}`);
    }
    if (!byId[id]) throw new Error(`unknown service "${id}"`);
    ensureEntry(id);
    visiting.add(id);
    stack.push(id);
    for (const dep of requirementsFor(id)) addDep(id, dep);
    stack.pop();
    visiting.delete(id);
  }

  for (const id of Object.keys(selection || {}).sort()) walk(id);

  // Topological order with canonical ID tie-break.
  const indeg = Object.fromEntries(Object.keys(effective).map((id) => [id, 0]));
  const edges = [];
  for (const id of Object.keys(effective)) {
    for (const dep of requirementsFor(id)) {
      if (!effective[dep.service]) continue;
      edges.push([dep.service, id]);
      indeg[id] += 1;
    }
  }

  const ready = Object.keys(effective)
    .filter((id) => indeg[id] === 0)
    .sort();
  const order = [];
  const seen = new Set();
  while (ready.length) {
    const id = ready.shift();
    if (seen.has(id)) continue;
    seen.add(id);
    order.push(id);
    for (const [from, to] of edges) {
      if (from === id) {
        indeg[to] -= 1;
        if (indeg[to] === 0) ready.push(to);
      }
    }
    ready.sort();
  }
  for (const id of Object.keys(effective).sort()) {
    if (!seen.has(id)) order.push(id);
  }

  const arrayView = order.map((id) => ({
    id,
    grade: effective[id].selected_grade,
    reason: effective[id].install_reason === 'dependency' ? 'dependency' : 'selected',
    slices: [...effective[id].required_slices],
    required_by: [...effective[id].required_by],
  }));
  arrayView.effective = effective;
  arrayView.order = order;
  arrayView.services = effective;
  return arrayView;
}

module.exports = { resolve };
