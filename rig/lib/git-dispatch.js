'use strict';

const { spawnSync } = require('node:child_process');
const { scanHarnessText } = require('./inspect');

const HARNESS_NAMES = new Set(['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', '.cursorrules', 'copilot-instructions.md']);
function isHarness(rel) { return HARNESS_NAMES.has(rel) || ['.cursor/', '.claude/', '.agents/', '.kiro/', '.github/instructions/', '.github/copilot-instructions.md'].some((prefix) => rel.startsWith(prefix)); }

function stagedFiles(target) {
  const changed = spawnSync('git', ['diff', '--cached', '--name-only', '-z'], {
    cwd: target,
    encoding: null,
    shell: false,
    maxBuffer: 16 * 1024 * 1024,
  });
  const indexed = spawnSync('git', ['ls-files', '--stage', '-z'], {
    cwd: target,
    encoding: null,
    shell: false,
    maxBuffer: 16 * 1024 * 1024,
  });
  if (changed.status !== 0 || indexed.status !== 0) {
    // Do not silently open the gate when git itself failed. Caller must
    // treat this as a scan failure, not a clean scan.
    return { ok: false };
  }
  const entries = new Map();
  for (const row of indexed.stdout.toString('utf8').split('\0').filter(Boolean)) {
    const tab = row.indexOf('\t');
    if (tab < 0) return { ok: false };
    const [mode, object, stage] = row.slice(0, tab).split(' ');
    const rel = row.slice(tab + 1);
    if (!/^[0-7]{6}$/.test(mode || '') || !/^[a-f0-9]{40,64}$/.test(object || '') || !/^[0-3]$/.test(stage || '')) {
      return { ok: false };
    }
    const stages = entries.get(rel) || [];
    stages.push({ mode, object, stage: Number(stage) });
    entries.set(rel, stages);
  }
  const paths = changed.stdout.toString('utf8').split('\0').filter(Boolean);
  const files = [];
  for (const rel of paths) {
    const indexedStages = entries.get(rel) || [];
    if (indexedStages.length === 0) continue; // staged deletion has no blob to scan
    const entry = indexedStages.find((candidate) => candidate.stage === 0);
    if (!entry || (isHarness(rel) && entry.mode !== '100644' && entry.mode !== '100755')) return { ok: false };
    const blob = spawnSync('git', ['cat-file', 'blob', entry.object], {
      cwd: target,
      encoding: null,
      shell: false,
      maxBuffer: 16 * 1024 * 1024,
    });
    if (blob.status !== 0 || blob.error || blob.stdout.length >= 16 * 1024 * 1024) return { ok: false };
    const bytes = blob.stdout;
    const text = bytes.toString('utf8');
    if (isHarness(rel) && !Buffer.from(text).equals(bytes)) return { ok: false, reason: 'invalid_utf8_staged_content' };
    files.push({ path: rel, text, bytes });
  }
  return { ok: true, files };
}

function stagedHarnessFiles(target) {
  const result = stagedFiles(target);
  return result.ok ? { ...result, files: result.files.filter((file) => isHarness(file.path)) } : result;
}
function runPreCommit(target) {
  try {
    const result = require('./policy-baseline').runBaseline(target, { surface: 'git.pre_commit', scope: 'diff' });
    return { allowed: result.status === 0, steps: result.results.filter((entry) => !['disabled', 'not_run'].includes(entry.status)).map((entry) => entry.control),
      findings: result.results.flatMap((entry) => entry.findings || []), results: result.results };
  } catch (error) {
    return { allowed: false, steps: [], findings: [{ kind: 'policy_unavailable', reason: error.message }] };
  }
}
module.exports = { runPreCommit, stagedFiles, stagedHarnessFiles, isHarness };
