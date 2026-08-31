// Bounded harness inspection (impl-design §5.2, AD-7).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { validateReview, VERDICTS, KNOWN_RESTRICTIONS } = require('./catalog');
const { discoverHosts } = require('./host-capabilities');
const { canonical } = require('./skill-catalog');

const MAX_BYTES = 256 * 1024;
const HARNESS_NAMES = new Set([
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  '.cursorrules',
  'copilot-instructions.md',
]);
const HARNESS_DIRS = [
  '.cursor/rules',
  '.windsurf/rules',
  '.clinerules',
  '.agents/rules',
  '.agents/skills',
  '.claude/skills',
  '.kiro/steering',
  'hooks',
];
const SECRET_RE =
  /(?<![a-z0-9])sk-[a-z0-9-]{10,}|gh[po]_[a-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/gi;

function redact(text) {
  return String(text).replace(SECRET_RE, '[REDACTED]');
}

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function realpathOrNull(p) {
  try {
    return fs.realpathSync(p);
  } catch {
    return null;
  }
}

function collectHarnessFiles(target) {
  const out = [];
  for (const name of HARNESS_NAMES) {
    const p = path.join(target, name);
    if (fs.existsSync(p)) out.push(p);
  }
  const githubCopilot = path.join(target, '.github', 'copilot-instructions.md');
  if (fs.existsSync(githubCopilot)) out.push(githubCopilot);
  for (const dir of HARNESS_DIRS) {
    const abs = path.join(target, dir);
    if (!fs.existsSync(abs)) continue;
    const walk = (d, ancestors = new Set()) => {
      const real = realpathOrNull(d);
      if (real && ancestors.has(real)) return;
      const nextAncestors = new Set(ancestors);
      if (real) nextAncestors.add(real);
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, entry.name);
        if (entry.isDirectory()) {
          walk(p, nextAncestors);
          continue;
        }
        if (entry.isSymbolicLink()) {
          const resolved = realpathOrNull(p);
          if (resolved && (resolved.startsWith(target + path.sep) || resolved === target)) {
            try {
              if (fs.statSync(p).isDirectory()) {
                walk(p, nextAncestors);
                continue;
              }
            } catch {
              /* inspectTarget records unreadable symlinks below */
            }
          }
        }
        out.push(p);
      }
    };
    walk(abs);
  }
  return out;
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function inside(root, candidate) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

function inventoryHost(rel) {
  if (rel === 'CLAUDE.md' || rel.startsWith('.claude/')) return 'claude';
  if (rel === 'GEMINI.md' || rel.startsWith('.gemini/')) return 'gemini';
  if (rel === '.cursorrules' || rel.startsWith('.cursor/')) return 'cursor';
  if (rel.startsWith('.windsurf/')) return 'windsurf';
  if (rel === '.clinerules' || rel.startsWith('.clinerules/')) return 'cline';
  if (rel.startsWith('.kiro/')) return 'kiro';
  if (rel === '.github/copilot-instructions.md' || rel === 'copilot-instructions.md') return 'copilot';
  if (rel === 'AGENTS.md' || rel.startsWith('.agents/')) return 'codex';
  return 'generic';
}

function inventoryKind(rel) {
  if (
    HARNESS_NAMES.has(rel)
    || rel === '.github/copilot-instructions.md'
  ) return 'instruction';
  if (rel.startsWith('.cursor/rules/') || rel.startsWith('.windsurf/rules/')
    || rel.startsWith('.clinerules/') || rel.startsWith('.agents/rules/')) return 'rule';
  if (rel.startsWith('.kiro/steering/')) return 'steering';
  if (rel.startsWith('.agents/skills/') || rel.startsWith('.claude/skills/')) {
    return path.posix.basename(rel) === 'SKILL.md' ? 'skill' : 'skill-asset';
  }
  if (rel.startsWith('hooks/')) return 'hook';
  return 'other';
}

function inventoryString(value) {
  return redact(String(value)).replace(/\s+/g, ' ').trim();
}

function unquote(value) {
  const text = value.trim();
  if (text.length >= 2 && ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'")))) {
    return text.slice(1, -1);
  }
  return text;
}

function inventoryFrontmatter(text) {
  if (!text.startsWith('---\n')) return {};
  const lines = text.split('\n');
  const closingAt = lines.slice(1).findIndex((line) => line === '---');
  if (closingAt === -1) throw new Error('malformed frontmatter');
  const closing = closingAt + 1;
  const fields = {};
  for (let index = 1; index < closing; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):(.*)$/);
    if (!match) throw new Error('malformed frontmatter');
    const [, key, rest] = match;
    const inline = rest.trim();
    if (inline === '>' || inline === '|') {
      const parts = [];
      while (index + 1 < closing && /^\s/.test(lines[index + 1])) {
        index += 1;
        parts.push(lines[index].trim());
      }
      fields[key] = inline === '>' ? parts.join(' ').trim() : parts.join('\n').trim();
      continue;
    }
    if (inline) {
      fields[key] = unquote(inline);
      continue;
    }
    const values = [];
    let validSequence = true;
    while (index + 1 <= closing && /^\s/.test(lines[index + 1])) {
      index += 1;
      const child = lines[index].trim();
      if (!child) continue;
      if (!child.startsWith('- ')) validSequence = false;
      else values.push(unquote(child.slice(2)));
    }
    fields[key] = validSequence ? values : null;
  }
  return fields;
}

function inventoryMetadata(text, fallback) {
  const fields = inventoryFrontmatter(text);
  if (fields.name !== undefined && typeof fields.name !== 'string') throw new Error('malformed frontmatter name');
  if (fields.title !== undefined && typeof fields.title !== 'string') throw new Error('malformed frontmatter title');
  if (fields.capability !== undefined && (typeof fields.capability !== 'string' || !/^[a-z0-9-]+\.[a-z0-9-]+$/.test(fields.capability))) {
    throw new Error('malformed frontmatter capability');
  }
  if (fields.overlap_tags !== undefined && (!Array.isArray(fields.overlap_tags)
    || fields.overlap_tags.some((tag) => !/^[a-z0-9-]+$/.test(tag)))) {
    throw new Error('malformed frontmatter overlap tags');
  }
  const headings = text.split('\n').flatMap((line) => {
    const match = line.match(/^#{1,6}\s+(.+?)(?:\s+#+)?\s*$/);
    return match ? [inventoryString(match[1])] : [];
  }).filter(Boolean);
  const capabilityTags = [
    ...(fields.capability ? [fields.capability] : []),
    ...(fields.overlap_tags || []),
  ].map(inventoryString).filter(Boolean).sort();
  return {
    name: inventoryString(fields.name || fallback),
    title: inventoryString(fields.title || fields.name || headings[0] || fallback),
    headings,
    capability_tags: [...new Set(capabilityTags)],
  };
}

function inventoryOwnedPaths(root) {
  const manifest = path.join(root, '.rig', 'install-manifest.jsonl');
  if (!fs.existsSync(manifest)) return new Set();
  const latest = new Map();
  for (const line of fs.readFileSync(manifest, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const record = JSON.parse(line);
      if (record.path && record.state === 'applied') latest.set(record.path, record);
    } catch {
      // A malformed journal cannot make untrusted repository content disappear
      // from inventory; it simply contributes no ownership claim.
    }
  }
  return new Set([...latest.values()]
    .filter((record) => record.ownership === 'create_owned' || record.ownership === 'replace_owned')
    .map((record) => record.path));
}

// Structural only: reads known harness locations, returns declared metadata,
// and never interprets prose as an agent's desired capability.
function inventoryHarness(target) {
  const root = realpathOrNull(target);
  if (!root) throw new Error('inventory: target must exist');
  const entries = [];
  const warnings = [];
  const seenRealPaths = new Map();
  const ownedPaths = inventoryOwnedPaths(root);
  for (const file of collectHarnessFiles(root)) {
    const rawRel = toPosix(path.relative(root, file));
    let real;
    try {
      real = fs.realpathSync(file);
    } catch (error) {
      warnings.push({ path: inventoryString(rawRel), code: 'unreadable', detail: inventoryString(error.code || 'unreadable') });
      continue;
    }
    if (!inside(root, real)) throw new Error(`inventory: escaping symlink rejected at ${rawRel}`);
    const prior = seenRealPaths.get(real);
    if (prior && prior !== rawRel) throw new Error(`inventory: duplicate real path alias ${prior} and ${rawRel}`);
    seenRealPaths.set(real, rawRel);
    if (ownedPaths.has(rawRel)) continue;
    let stat;
    try {
      stat = fs.statSync(file);
    } catch (error) {
      warnings.push({ path: inventoryString(rawRel), code: 'unreadable', detail: inventoryString(error.code || 'unreadable') });
      continue;
    }
    if (!stat.isFile()) {
      warnings.push({ path: inventoryString(rawRel), code: 'unreadable', detail: 'not a regular file' });
      continue;
    }
    if (stat.size > MAX_BYTES) {
      warnings.push({ path: inventoryString(rawRel), code: 'oversized', detail: `exceeds ${MAX_BYTES} byte limit` });
      continue;
    }
    let bytes;
    let text;
    try {
      bytes = fs.readFileSync(file);
      text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch {
      warnings.push({ path: inventoryString(rawRel), code: 'non-utf8', detail: 'not valid UTF-8' });
      continue;
    }
    const kind = inventoryKind(rawRel);
    let metadata;
    try {
      metadata = inventoryMetadata(text, path.posix.basename(rawRel, '.md'));
    } catch {
      warnings.push({ path: inventoryString(rawRel), code: 'malformed-frontmatter', detail: 'declared metadata is malformed' });
      continue;
    }
    entries.push({
      path: inventoryString(rawRel),
      host: inventoryHost(rawRel),
      kind,
      name: metadata.name,
      title: metadata.title,
      headings: metadata.headings,
      capability_tags: metadata.capability_tags,
      bytes: stat.size,
      sha256: sha256(bytes),
    });
  }
  entries.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  warnings.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : a.code < b.code ? -1 : a.code > b.code ? 1 : 0));
  return {
    schema_version: 1,
    digest: sha256(canonical({ entries, warnings })),
    entries,
    warnings,
  };
}

function explicitHosts(host, hosts) {
  const ids = host ? [host] : Array.isArray(hosts) ? hosts : [];
  return ids.filter((id) => id && id !== 'auto');
}

function inspectTarget(target, { host, hosts } = {}) {
  const root = realpathOrNull(target);
  if (!root || !fs.existsSync(root)) throw new Error('inspect: target must exist');
  const explicit = explicitHosts(host, hosts);
  const detectedHosts = discoverHosts(root, { explicit });

  const findings = [];
  const inputs = [];
  const hash = crypto.createHash('sha256');

  for (const file of collectHarnessFiles(root)) {
    const rel = path.relative(root, file);
    let st;
    try {
      st = fs.lstatSync(file);
    } catch (error) {
      findings.push({ path: rel, kind: 'unreadable', detail: String(error.message) });
      continue;
    }
    if (st.isSymbolicLink()) {
      const resolved = realpathOrNull(file);
      if (!resolved || !resolved.startsWith(root + path.sep) && resolved !== root) {
        throw new Error(`inspect: escaping symlink rejected at ${rel}`);
      }
    }
    if (st.size > MAX_BYTES) {
      findings.push({ path: rel, kind: 'oversized', bytes: st.size, limit: MAX_BYTES });
      hash.update(rel);
      hash.update(`oversized:${st.size}`);
      continue;
    }
    const bytes = fs.readFileSync(file);
    const digest = sha256(bytes);
    hash.update(rel);
    hash.update(digest);
    const text = bytes.toString('utf8');
    const redacted = redact(text);
    inputs.push({ path: rel, sha256: digest, bytes: st.size });
    if (/exfiltrat|ignore prior|curl .*evil|bypass.*(guard|permission)/i.test(text)) {
      findings.push({
        path: rel,
        kind: 'suspicious_directive',
        evidence: redact(text.slice(0, 240)),
      });
    }
    if (SECRET_RE.test(text)) {
      SECRET_RE.lastIndex = 0;
      findings.push({
        path: rel,
        kind: 'secret_shaped',
        evidence: '[REDACTED]',
      });
    }
    void redacted;
  }

  return {
    schema_version: 1,
    ...(host && host !== 'auto' ? { host } : {}),
    hosts: detectedHosts,
    harness_digest: hash.digest('hex'),
    inputs,
    findings,
    redaction: 'secret-shaped evidence redacted',
  };
}

function hostReview(inspection) {
  if (!inspection || typeof inspection !== 'object' || inspection.schema_version !== 1) {
    throw new Error('host-review: malformed inspection');
  }
  if (typeof inspection.harness_digest !== 'string' || !inspection.harness_digest) {
    throw new Error('host-review: stale or malformed inspection');
  }
  const verdict = adoptionVerdict({
    findings: inspection.findings || [],
    unverifiable: inspection.unverifiable || [],
  });
  const detected = Array.isArray(inspection.hosts) && inspection.hosts[0] && inspection.hosts[0].id;
  return {
    schema_version: 1,
    host: inspection.host || detected || 'generic',
    harness_digest: inspection.harness_digest,
    verdict: verdict.verdict,
    findings: inspection.findings || [],
    restrictions: inspection.restrictions || [],
    unverifiable: inspection.unverifiable || [],
  };
}

function adoptionVerdict({ findings = [], unverifiable = [] } = {}) {
  const blockers = findings.filter((f) => f && f.severity === 'blocker');
  if (blockers.length) return { verdict: 'BLOCK', findings: blockers, unverifiable };
  if (unverifiable.length) return { verdict: 'QUARANTINE', findings, unverifiable };
  return { verdict: 'ALLOW', findings, unverifiable };
}

function hostReview(inspection) {
  if (!inspection || typeof inspection !== 'object' || Array.isArray(inspection)) {
    throw new Error('host-review: inspection must be an object');
  }
  if (inspection.schema_version !== 1) throw new Error('host-review: malformed inspection');
  if (typeof inspection.harness_digest !== 'string' || !inspection.harness_digest) {
    throw new Error('host-review: inspection harness_digest required');
  }
  if (inspection.findings !== undefined && !Array.isArray(inspection.findings)) {
    throw new Error('host-review: findings must be an array');
  }
  if (inspection.unverifiable !== undefined && !Array.isArray(inspection.unverifiable)) {
    throw new Error('host-review: unverifiable must be an array');
  }
  const findings = Array.isArray(inspection.findings) ? inspection.findings : [];
  const unverifiable = Array.isArray(inspection.unverifiable) ? inspection.unverifiable : [];
  const restrictions = Array.isArray(inspection.restrictions) ? inspection.restrictions : [];
  const decided = adoptionVerdict({ findings, unverifiable });
  const host = inspection.host || (Array.isArray(inspection.hosts) && inspection.hosts[0] && inspection.hosts[0].id) || undefined;
  const review = {
    schema_version: 1,
    harness_digest: inspection.harness_digest,
    ...(host ? { host } : {}),
    verdict: decided.verdict,
    findings,
    restrictions,
    unverifiable,
    reviewer: { kind: 'host-agent', host: host || 'generic' },
  };
  if (inspection.manualEntries && typeof inspection.manualEntries === 'object') {
    review.manualEntries = inspection.manualEntries;
  }
  return review;
}

module.exports = {
  HARNESS_DIRS,
  HARNESS_NAMES,
  collectHarnessFiles,
  inventoryHarness,
  MAX_BYTES,
  inspectTarget,
  hostReview,
  redact,
  validateReview,
  validateVerdict: validateReview,
  VERDICTS,
  KNOWN_RESTRICTIONS,
  adoptionVerdict,
  hostReview,
};
