'use strict';

// Design review for proposed components: each row of the design table is traced
// to current repository code or to a pinned upstream revision, adoption is gated
// on licence and pin, and wiki claims that current code contradicts are flagged.

const fs = require('node:fs');
const path = require('node:path');

const ALLOWED_LICENCES = new Set(['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'MPL-2.0']);
// Own-code rows use 'n/a': there is no licence to check for code Rig already ships.
const NOT_APPLICABLE = 'n/a';
const GITHUB = /^https?:\/\/github\.com\/([^/\s()]+)\/([^/\s()]+)(?:\/blob\/([^/\s()]+)\/([^\s()]+))?(?:\s*\(([^)]+)\))?/;
const HEX_REVISION = /^[0-9a-f]{7,40}$/i;
const STORED_IN = /\bstored in\s+([A-Za-z][\w+-]*)/gi;

// Compares a wiki stem with a seam stem: 'receipts' and 'receipt' are the same topic.
const topicKey = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/s$/, '');

function parseComponents(markdown) {
  const rows = [];
  for (const line of markdown.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('|') || !t.endsWith('|')) continue;
    const cells = t.slice(1, -1).split('|').map((c) => c.trim());
    if (cells.length < 3 || cells[0] === 'Component') continue;
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
    rows.push({ name: cells[0], source: cells[1], licence: cells[2] });
  }
  return rows;
}

// Module specifiers and exports are enough to show what a seam consumes and offers.
function readSeam(repo, rel) {
  const src = fs.readFileSync(path.join(repo, rel), 'utf8');
  const requires = [...src.matchAll(/(?:require\(\s*|\bfrom\s+|^\s*import\s+)['"]([^'"]+)['"]/gm)].map((m) => m[1]);
  const exported = [...src.matchAll(/exports\.([A-Za-z_$][\w$]*)\s*=/g)].map((m) => m[1]);
  if (/module\.exports\s*=/.test(src)) exported.push('module.exports');
  exported.push(...[...src.matchAll(/\bexport\s+(?:async\s+)?(?:const|let|var|function\*?|class)\s+([A-Za-z_$][\w$]*)/g)].map((m) => m[1]));
  const boundary = [];
  if (/\bthrow\b/.test(src)) boundary.push('throw');
  if (/\btry\s*\{/.test(src)) boundary.push('try');
  if (/\bcatch\s*\(/.test(src)) boundary.push('catch');
  return {
    data_flow: `consumes ${[...new Set(requires)].join(', ') || 'no modules'}; exposes ${[...new Set(exported)].join(', ') || 'no exports'}`,
    failure_boundary: boundary.length ? `explicit: ${boundary.join(', ')} in ${rel}` : `none in ${rel}: errors propagate to the caller`,
  };
}

function licenceProblem(licence, local) {
  if (ALLOWED_LICENCES.has(licence) || (local && licence === NOT_APPLICABLE)) return null;
  return `licence ${licence || '(none)'} is not permitted for adoption`;
}

function auditComponent(repo, row) {
  const component = {
    name: row.name, source: row.source, licence: row.licence,
    seam: null, data_flow: null, failure_boundary: null, pin: null,
    blocked: false, reason: null, notice: null, discard_scope: [],
  };
  const reasons = [];
  const local = /^`([^`]+)`$/.exec(row.source);
  const url = GITHUB.exec(row.source);

  if (local) {
    const rel = local[1];
    if (fs.existsSync(path.join(repo, rel))) {
      component.seam = rel;
      Object.assign(component, readSeam(repo, rel));
    } else reasons.push(`source path ${rel} does not exist in the repository`);
    const problem = licenceProblem(row.licence, true);
    if (problem) reasons.push(problem);
  } else if (url) {
    const ref = url[3] || url[5];
    if (!ref) reasons.push('no immutable revision pin: the upstream URL names no revision');
    else if (!HEX_REVISION.test(ref)) reasons.push(`no immutable revision pin: '${ref}' is a branch name, not a commit revision`);
    else component.pin = { repository: `${url[1]}/${url[2]}`, revision: ref, path: url[4] || null };
    const problem = licenceProblem(row.licence, false);
    if (problem) reasons.push(problem);
  } else {
    reasons.push('source is neither a backticked repository path nor a GitHub URL');
  }

  if (row.licence === 'Apache-2.0') {
    component.notice = `Apache-2.0 obligation: keep the upstream LICENSE and NOTICE and attribute ${row.source} in the adopted copy`;
  }
  if (component.pin && component.pin.path) component.discard_scope = [`everything outside ${component.pin.path} in ${component.pin.repository}`];

  component.blocked = reasons.length > 0;
  component.reason = reasons.length ? reasons.join('; ') : null;
  return { component, reasons };
}

function walkMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walkMarkdown(p);
    return e.name.endsWith('.md') ? [p] : [];
  });
}

function staleWikiFindings(repo, components) {
  const findings = [];
  const seams = components.filter((c) => c.seam);
  for (const file of walkMarkdown(path.join(repo, 'wiki'))) {
    const base = path.basename(file, '.md');
    const where = path.relative(repo, file).split(path.sep).join('/');
    const text = fs.readFileSync(file, 'utf8');
    for (const seam of seams) {
      if (topicKey(base) !== topicKey(path.basename(seam.seam, path.extname(seam.seam)))) continue;
      const code = fs.readFileSync(path.join(repo, seam.seam), 'utf8').toLowerCase();
      for (const m of text.matchAll(STORED_IN)) {
        if (!code.includes(m[1].toLowerCase())) {
          findings.push({ where, problem: `stale: wiki claims ${base} is stored in ${m[1]}, which contradicts current code in ${seam.seam}` });
        }
      }
    }
  }
  return findings;
}

function review(repo, { design } = {}) {
  if (!design) throw new Error('review needs { design }: the design markdown path');
  const designFile = path.resolve(repo, design);
  const designRel = path.relative(repo, designFile).split(path.sep).join('/');
  const components = [];
  const findings = [];
  for (const row of parseComponents(fs.readFileSync(designFile, 'utf8'))) {
    const { component, reasons } = auditComponent(repo, row);
    components.push(component);
    for (const problem of reasons) findings.push({ where: `${designRel} / ${component.name}`, problem });
  }
  findings.push(...staleWikiFindings(repo, components));

  const result = { components, findings };
  fs.mkdirSync(path.join(repo, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(repo, '.rig', 'design-audit.json'), `${JSON.stringify(result, null, 2)}\n`);
  return result;
}

module.exports = { review };
