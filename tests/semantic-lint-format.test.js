#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  withRepo,
  writeJson,
  readJson,
  allowedReview,
  writeSelection,
  plan,
  apply,
} = require('./helpers/advanced');
const { buildBinding, validateBindingSources } = require('../rig/lib/lint-format');

test('semantic binding covers nonstandard tasks, configured tools, ignores, and arbitrary nesting', () => {
  withRepo((target) => {
    writeJson(path.join(target, 'package.json'), {
      scripts: {
        'quality:gate': 'eslint .',
        'style:guard': 'prettier --check .',
        'style:repair': 'prettier --write .',
      },
    });
    fs.writeFileSync(path.join(target, '.gitignore'), 'generated/**\n');

    const pythonRoot = path.join(target, 'a/b/c/d/e/f/g/python');
    fs.mkdirSync(pythonRoot, { recursive: true });
    fs.writeFileSync(path.join(pythonRoot, 'pyproject.toml'), '[tool.ruff]\n');
    fs.writeFileSync(path.join(pythonRoot, '.gitignore'), '.cache/**\n');

    const customRoot = path.join(target, 'tools/custom');
    fs.mkdirSync(customRoot, { recursive: true });
    fs.writeFileSync(
      path.join(customRoot, 'novel-tool.conf'),
      'role=formatter\ncommand=["novelfmt","--check","."]\n',
    );

    const binding = buildBinding(target, 'mid');
    const root = binding.components.find((component) => component.root === '.');
    const python = binding.components.find((component) => component.root.endsWith('/python'));
    const custom = binding.components.find((component) => component.root === 'tools/custom');

    assert.deepEqual(root.format_check.argv, ['npm', 'run', '--silent', 'style:guard']);
    assert.deepEqual(root.format.argv, ['npm', 'run', '--silent', 'style:repair']);
    assert.deepEqual(root.lint.argv, ['npm', 'run', '--silent', 'quality:gate']);
    assert.equal(root.cwd, '.');
    assert.deepEqual(root.ignores, ['generated/**']);

    assert.deepEqual(python.format_check.argv, ['ruff', 'format', '--check', '.']);
    assert.deepEqual(python.lint.argv, ['ruff', 'check', '.']);
    assert.equal(python.cwd, python.root);
    assert.ok(python.ignores.includes('.cache/**'));

    assert.equal(custom.ecosystem, 'unknown');
    assert.deepEqual(custom.format_check.argv, ['novelfmt', '--check', '.']);
    assert.equal(custom.cwd, 'tools/custom');
  });
});

test('ambiguous tasks require a choice and uncoverable components suppress repository coverage', () => {
  withRepo((target) => {
    writeJson(path.join(target, 'package.json'), {
      scripts: {
        'style:guard': 'prettier --check .',
        'quality:eslint': 'eslint .',
        'quality:biome': 'biome lint .',
      },
    });
    const unknownRoot = path.join(target, 'legacy');
    fs.mkdirSync(unknownRoot);
    fs.writeFileSync(path.join(unknownRoot, 'novel-tool.conf'), 'role=linter\n');

    const binding = buildBinding(target, 'mid');
    const root = binding.components.find((component) => component.root === '.');
    const legacy = binding.components.find((component) => component.root === 'legacy');

    assert.equal(root.lint.status, 'needs_user_choice');
    assert.deepEqual(
      root.lint.options.map((option) => option.argv),
      [
        ['npm', 'run', '--silent', 'quality:biome'],
        ['npm', 'run', '--silent', 'quality:eslint'],
      ],
    );
    assert.equal(legacy.excluded, true);
    assert.match(legacy.exclusion_reason, /no runnable formatter check/i);
    assert.deepEqual(binding.unprotected, ['legacy']);
    assert.equal(binding.coverage.whole_repository, false);
    assert.equal(binding.support_claim.whole_repository, 'suppressed');
    assert.throws(() => validateBindingSources(target, binding), /user choice.*quality:biome.*quality:eslint/i);
  });
});

test('configured-tool ambiguity is preserved through plan and blocks apply', () => {
  withRepo((target) => {
    writeJson(path.join(target, 'package.json'), {});
    fs.writeFileSync(path.join(target, '.prettierrc'), '{}\n');
    fs.writeFileSync(path.join(target, 'biome.json'), '{}\n');
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'development.code-quality.lint-format': 'minimal' });

    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    const binding = readJson(planned.outPath).lint_format;
    assert.equal(binding.components[0].format_check.status, 'needs_user_choice');

    const applied = apply(target, { review: reviewPath, plan: planned.outPath });
    assert.notEqual(applied.status, 0);
    assert.match(applied.stderr + applied.stdout, /user choice required.*biome.*prettier/i);
  });
});
