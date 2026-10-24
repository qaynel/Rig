'use strict';

// Deterministic inventory and validation only: the repository's agent supplies
// component meaning, command roles, exclusions, and the scope for approval.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { containedPath } = require('./path-safety');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const SELECTION = 'rig-lint-format.json';

function inventoryRepository(target) {
  const files = [];
  const directories = [];
  function walk(root) {
    const directory = root === '.' ? target : containedPath(target, root);
    directories.push(root);
    for (const item of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (['.git', '.rig', 'node_modules'].includes(item.name)) continue;
      const rel = root === '.' ? item.name : `${root}/${item.name}`;
      if (rel.startsWith('reports/rig/')) continue;
      if (item.isDirectory()) walk(rel);
      else if (item.isFile()) files.push({ path: rel, digest: hash(fs.readFileSync(containedPath(target, rel))) });
      else files.push({ path: rel, kind: 'unsupported_path', reason: 'Only regular repository files are inventoried' });
    }
  }
  walk('.');
  return { files, directories, interpretation: 'The host agent assigns components and command roles from this inventory; unknown files remain visible.' };
}

function bindAgentSelection(target, grade, selection, selectionPath = null) {
  if (selection?.schema_version !== 1 || !['diff', 'repo'].includes(selection.scope) || !Array.isArray(selection.components) || !Array.isArray(selection.excluded || [])) throw new Error('lint-format: invalid agent selection schema, scope, or components');
  const inventory = inventoryRepository(target);
  const paths = new Set(inventory.files.map(file => file.path));
  const roots = new Set();
  const components = selection.components.map(input => {
    if (!input || typeof input !== 'object' || (input.id !== undefined && (typeof input.id !== 'string' || !input.id.trim() || input.id.includes('\0')))) throw new Error('lint-format: component needs a valid identity');
    const root = input.root;
    if (typeof root !== 'string' || (root !== '.' && !inventory.directories.includes(root)) || roots.has(root)) throw new Error('lint-format: component root is missing, duplicate, or outside the repository');
    roots.add(root);
    const evidence = input.evidence_paths;
    if (!Array.isArray(evidence) || !evidence.length || evidence.some(rel => !paths.has(rel))) throw new Error(`lint-format: ${root} needs repository evidence paths`);
    const sourcePaths = new Set([...evidence, ...(selectionPath ? [selectionPath] : [])]);
    const bound = { id: input.id || root, root, cwd: root, ecosystem: input.ecosystem || 'unknown', include: input.include || ['**'], ignores: input.ignores || [], agent_selected: true };
    for (const list of [bound.include, bound.ignores]) if (!Array.isArray(list) || list.some(item => typeof item !== 'string' || !item || item.includes('\0'))) throw new Error(`lint-format: ${root} needs valid include/ignore patterns`);
    for (const role of ['format_check', 'lint', 'format']) {
      const command = input[role];
      if (!command) continue;
      if (command.status === 'needs_user_choice' || command.options) throw new Error(`lint-format: user choice required for ${root} ${role}`);
      if (!Array.isArray(command.argv) || !command.argv.length || command.argv.some(arg => typeof arg !== 'string' || !arg || arg.includes('\0')) || !paths.has(command.source)) throw new Error(`lint-format: ${root} ${role} needs executable argv and a repository rule source`);
      if (command.cwd && command.cwd !== root) throw new Error(`lint-format: ${root} ${role} cwd must equal its component root`);
      if (command.network !== undefined && !['none', 'required'].includes(command.network)) throw new Error('lint-format: invalid declared network capability');
      sourcePaths.add(command.source);
      bound[role] = { ...command, cwd: root, network: command.network || 'none' };
    }
    bound.sources = [...sourcePaths].sort().map(rel => ({ path: rel, digest: hash(fs.readFileSync(containedPath(target, rel))) }));
    bound.manifest = evidence[0];
    bound.manifest_digest = bound.sources.find(source => source.path === evidence[0]).digest;
    return bound;
  });
  const excluded = (selection.excluded || []).map(item => {
    if (!item || typeof item.root !== 'string' || !inventory.directories.includes(item.root) || typeof item.reason !== 'string' || !item.reason.trim() || roots.has(item.root)) throw new Error('lint-format: excluded components need a separate repository root and reason');
    return { ...item, excluded: true };
  });
  const covered = rel => !excluded.some(item => item.root === '.' || rel.startsWith(`${item.root}/`)) && components.some(component => scopedCommand({ argv: ['{files}'] }, component, [rel], selection.scope).scoped_files.length > 0);
  const uncovered = inventory.files.filter(file => !covered(file.path)).map(file => file.path);
  const checks = {};
  for (const [role, checkId] of [['format_check', 'lint-format-formatter-clean'], ...(grade === 'minimal' ? [] : [['lint', 'lint-format-linter-clean']])]) {
    const missing = components.filter(component => !component[role]);
    checks[checkId] = missing.length || !components.length ? { coverage_gap: `${missing.map(component => component.id).join(', ') || 'selected components'}: ${role} task missing` } : { commands: components.map(component => component[role]) };
  }
  if (grade === 'maximal') checks['lint-format-ci-gate-and-explicit-fix'] = { coverage_gap: 'local Evidence uses rig check review and replay; CI enforcement requires a separately approved CI binding' };
  return {
    engine: 'component-lint-format-v1', disposition: 'executable', grade, scope: selection.scope,
    components, excluded, unprotected: [...new Set([...excluded.map(item => item.root), ...uncovered.map(rel => path.posix.dirname(rel))])].sort(),
    uncovered_files: uncovered, checks, agent_selection: selection,
    coverage: { whole_repository: components.length > 0 && !uncovered.length && !excluded.length },
    support_claim: { whole_repository: components.length > 0 && !uncovered.length && !excluded.length ? 'pending_evidence' : 'suppressed' },
    ceiling: 'Policy executes approved scoped checks; Context requires a current semantic review; Evidence requires matching replay. Excluded and uncovered files have no support claim.',
  };
}

function loadAgentBinding(target, grade) {
  const file = containedPath(target, SELECTION);
  if (!fs.existsSync(file)) return null;
  return bindAgentSelection(target, grade, JSON.parse(fs.readFileSync(file, 'utf8')), SELECTION);
}

function scopedCommand(command, component, files, scope) {
  const prefix = component.root === '.' ? '' : `${component.root}/`;
  const local = files.filter(file => !prefix || file.startsWith(prefix)).map(file => prefix ? file.slice(prefix.length) : file);
  if (typeof path.matchesGlob !== 'function') throw new Error('scoped checks require a Node.js version with path.matchesGlob; upgrade Node.js');
  const ignored = (file, pattern) => {
    if (path.matchesGlob(file, pattern)) return true;
    if (!pattern.endsWith('/')) return false;
    const directoryPattern = pattern.slice(0, -1);
    const parts = file.split('/');
    for (let end = 1; end < parts.length; end++) {
      const directory = parts.slice(0, end).join('/');
      if (path.matchesGlob(directory, directoryPattern) ||
          (!directoryPattern.includes('/') && path.matchesGlob(path.posix.basename(directory), directoryPattern))) return true;
    }
    return false;
  };
  const selected = local.filter(file => (component.include || ['**']).some(pattern => path.matchesGlob(file, pattern)) && !(component.ignores || []).some(pattern => ignored(file, pattern)));
  const count = command.argv.filter(arg => arg === '{files}').length;
  if (count > 1) throw new Error('only one {files} argument is allowed');
  if (!count && scope === 'diff') throw new Error('changed-file scope requires an approved {files} argv placeholder; approve a scoped command or explicit repo scope');
  return { ...command, cwd: component.root, argv: command.argv.flatMap(arg => arg === '{files}' ? selected : [arg]), scoped_files: selected, skip: count === 1 && !selected.length };
}

module.exports = { inventoryRepository, bindAgentSelection, loadAgentBinding, scopedCommand, SELECTION };
