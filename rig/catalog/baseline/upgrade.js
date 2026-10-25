'use strict';

// Public upgrade, documentation and removal (R069, R070, R079).
//
// User-owned bytes are never touched. Rig-owned state is either migrated to
// the shipped model revision or left alone behind a repair report — a vector
// index from an incompatible revision is rebuilt, never mixed.

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const embedding = require('./embedding');
const memory = require('./memory');

const RIG_DIR = '.rig';
// Logical path returned to callers; kept POSIX-form so it matches on every
// host regardless of path.sep (real fs access below tolerates either).
const INDEX = `${RIG_DIR}/memory/index.json`;

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

/**
 * Migrate a prior supported installation. Returns what moved, or stops with a
 * repair report naming what a human has to do.
 */
function run(repo, { to } = {}) {
  if (typeof to !== 'string' || !to.trim()) return { stopped: true, repair_report: 'name the destination release before upgrading' };
  const release = readJson(path.join(repo, RIG_DIR, 'release.json'));
  if (!release || !release.tag) {
    return { stopped: true, repair_report: `${RIG_DIR}/release.json is missing or has no tag; reinstall before upgrading` };
  }
  if (!embedding.available()) {
    return { stopped: true, repair_report: 'shipped embedding assets are missing or corrupt; reinstall the archive' };
  }

  const migrated = [];
  const indexFile = path.join(repo, INDEX);
  const existing = readJson(indexFile);
  if (fs.existsSync(indexFile) && !existing) return { stopped: true, repair_report: `${INDEX} is corrupt; preserve it and rebuild from verified memory records before upgrading` };
  if (existing && (existing.model_revision !== embedding.revision() || existing.dims !== embedding.dims())) {
    // Vectors from another revision are not comparable. Rebuild from the
    // records, which are the durable thing; the index is a derived cache.
    memory.index(repo);
    migrated.push(INDEX);
  }

  writeJson(path.join(repo, RIG_DIR, 'release.json'), { ...release, tag: to, upgraded_from: release.tag });
  migrated.push(`${RIG_DIR}/release.json`);
  return { migrated, from: release.tag, to };
}

/** The public pages a cold user follows, each with something to run. */
const UNINSTALL_SCRIPT = 'process.stdout.write(JSON.stringify(require(process.argv[1]).uninstall(process.argv[2])))';
const uninstallArgs = (repo) => ['-e', UNINSTALL_SCRIPT, path.resolve(__dirname, '../../lib/lifecycle.js'), path.resolve(repo)];
const shellQuote = (arg) => `'${arg.replace(/'/g, "'\\''")}'`;
const uninstallCommand = (repo) => [process.execPath, ...uninstallArgs(repo)].map(shellQuote).join(' ');

function documentation(repo = process.cwd()) {
  return [
    {
      stage: 'install',
      title: 'Install Rig',
      commands: ['sh rig/bootstrap.sh --target /path/to/repository'],
    },
    {
      stage: 'first-task',
      title: 'Your first task',
      surface: 'host-agent',
      commands: ['Invoke rig-onboarding in your coding agent, then describe the first change you want.'],
    },
    {
      stage: 'troubleshooting',
      title: 'When something looks wrong',
      commands: ['.rig/bin/rig inspect --target .', 'node .rig/bin/check-traceability.js'],
    },
    {
      stage: 'removal',
      title: 'Remove Rig',
      commands: [uninstallCommand(repo)],
    },
  ];
}

/** Remove every Rig-owned path. Anything the user wrote stays exactly as it is. */
function remove(repo) {
  // Reuse journal ownership, preimages and digest checks. A separate process
  // loads the removal runtime before its own installed files are removed.
  const result = spawnSync(process.execPath, uninstallArgs(repo), { encoding: 'utf8', timeout: 60000 });
  const commands_run = [uninstallCommand(repo)];
  if (result.error || result.status !== 0) return { removed_rig: false, removed: [], commands_run,
    repair_report: result.error?.message || result.stderr.trim() || 'journalled removal failed' };
  const evidence = JSON.parse(result.stdout);
  return { ...evidence, removed_rig: evidence.status === 'removed', commands_run };
}

module.exports = { run, documentation, remove };
