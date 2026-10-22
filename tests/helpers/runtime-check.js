'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { writeFixtureSemanticReview } = require('./semantic-review');

function writeFixtureLintSelection(target) {
  fs.writeFileSync(path.join(target, 'fixture-format-check.cjs'), "const fs = require('node:fs'); for (const file of process.argv.slice(2)) if (/[ \\t]+$/m.test(fs.readFileSync(file, 'utf8'))) process.exit(1);\n");
  fs.writeFileSync(path.join(target, 'rig-lint-format.json'), JSON.stringify({
    schema_version: 1, scope: 'diff', components: [{
      root: '.', ecosystem: 'javascript', evidence_paths: ['package.json', 'fixture-format-check.cjs'], include: ['*.js'],
      format_check: { argv: [process.execPath, 'fixture-format-check.cjs', '{files}'], source: 'fixture-format-check.cjs', network: 'none' },
    }], excluded: [],
  }) + '\n');
}

function prepareFixtureRuntimeCheck(target, reason) {
  const reviewed = writeFixtureSemanticReview(target, { reason });
  if (spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: target, stdio: 'ignore' }).status !== 0) {
    execFileSync('git', ['init', '-q'], { cwd: target });
  }
  const paths = ['.rig/context-index.json', ...reviewed.documents.map(item => item.path), 'package.json', 'index.js', 'rig-lint-format.json']
    .filter(rel => fs.existsSync(path.join(target, rel)));
  execFileSync('git', ['add', '-f', '--', ...paths], { cwd: target });
  const bindingsPath = path.join(target, '.rig/service-bindings.json');
  const binding = fs.existsSync(bindingsPath) && JSON.parse(fs.readFileSync(bindingsPath, 'utf8'))['development.code-quality.lint-format'];
  if (!binding) return;
  const inputs = require('../../rig/lib/lint-grade').installedGradeInputs({ target, binding, scope: binding.scope || 'diff' });
  if (inputs.gap) throw new Error(inputs.gap.reason);
  if (!inputs.commands.length) return;
  const signed = require('./task-approval').approved(target, inputs.commands, inputs.grade === 'maximal' ? 2 : 1);
  fs.mkdirSync(path.join(target, '.rig/lint-format'), { recursive: true });
  for (const [name, value] of [['execution-plan', signed.plan], ['execution-approval', signed.approval]]) {
    fs.writeFileSync(path.join(target, `.rig/lint-format/${name}.json`), JSON.stringify(value) + '\n');
  }
}
module.exports = { writeFixtureLintSelection, prepareFixtureRuntimeCheck };
