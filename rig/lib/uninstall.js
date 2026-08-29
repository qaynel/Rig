const fs = require('node:fs');
const path = require('node:path');
const { RECEIPT_PATH, readReceipt } = require('./receipt');
const { uninstall: uninstallJournal } = require('./lifecycle');
const { gitPath } = require('./path-safety');

function uninstall(target, opts = {}) {
  const result = uninstallJournal(target, opts);
  cleanupReceiptArtifacts(target, result);
  return result;
}

function cleanupReceiptArtifacts(target, journalResult = {}) {
  // Journal is the removal authority. The receipt path is only a compatibility
  // shim for legacy Basic MCP leftovers: skip it when no Basic receipt exists
  // so a journal-only uninstall cannot delete user files such as `.env.example`
  // or re-mutate a hook the journal already restored or retained.
  const retained = new Set(journalResult.best_effort || []);
  const journalTouchedHook = [...(journalResult.removed || []), ...(journalResult.best_effort || [])]
    .some((p) => typeof p === 'string' && (p === '.git/hooks/pre-commit' || p.startsWith('.git/hooks/pre-commit.')));

  const receipt = readReceipt(target);
  if (receipt) {
    for (const file of receipt.ownedFiles || []) {
      if (!retained.has(file)) rm(target, file);
    }
    for (const entry of receipt.mergedEntries || []) unmerge(target, entry.file, entry.serverName);

    for (const rel of ['.env.example', '.rig/mcp-setup.md', '.rig/hooks/secret-guard.sh', RECEIPT_PATH]) {
      if (!retained.has(rel)) rm(target, rel);
    }

    if (!journalTouchedHook) {
      const hooksDir = gitPath(target, 'hooks') || path.join(target, '.git', 'hooks');
      const hook = path.join(hooksDir, 'pre-commit');
      const chained = path.join(hooksDir, 'pre-commit.rig-chained');
      const hasRigShim = fs.existsSync(hook) && fs.readFileSync(hook, 'utf8').includes('Rig secret guard shim');
      if (fs.existsSync(chained) && (!fs.existsSync(hook) || hasRigShim)) fs.renameSync(chained, hook);
      else if (hasRigShim) fs.rmSync(hook, { force: true });
    }
  }

  // Durable one-use plan-approval records (rig/lib/lint-format.js's
  // consumePlanApproval) are internal execution state, not user-owned and
  // not journal-tracked -- they're written at run time, outside install.
  // Left behind, they silently block re-execution of a plan_digest that
  // happens to recur after a reinstall.
  const lintFormatDir = path.join(target, '.rig', 'lint-format');
  if (fs.existsSync(lintFormatDir)) fs.rmSync(lintFormatDir, { recursive: true, force: true });

  for (const rel of ['.rig/hooks', '.rig']) {
    const dir = path.join(target, rel);
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  }
}

function unmerge(target, file, serverName) {
  const p = path.join(target, file);
  if (!fs.existsSync(p) || !file.endsWith('.json')) return;
  try {
    const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
    for (const bag of [obj.mcpServers, obj.servers, obj.mcp && obj.mcp.servers, obj.mcp]) {
      if (bag && Object.prototype.hasOwnProperty.call(bag, serverName)) delete bag[serverName];
    }
    fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
  } catch {
    // User-owned malformed files are left untouched.
  }
}

function rm(target, rel) {
  const p = path.join(target, rel);
  if (fs.existsSync(p)) fs.rmSync(p, { force: true });
}

module.exports = { uninstall, cleanupReceiptArtifacts };
