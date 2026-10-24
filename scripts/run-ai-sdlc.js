#!/usr/bin/env node
// Separate evaluation lane. Explicit file arguments work with Windows Node 22
// as well as POSIX shells; directory discovery never silently runs one test.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.context', 'ai-sdlc');
fs.mkdirSync(output, { recursive: true });
const tests = fs.readdirSync(path.join(root, 'tests', 'ai-sdlc'))
  .filter((file) => file.endsWith('.test.js')).sort().map((file) => path.join('tests', 'ai-sdlc', file));
if (!tests.length) throw new Error('AI-SDLC lane has no proving-test files');

// CI must supply the sidecar from the build job alongside the downloaded bytes.
const archive = process.env.RIG_PUBLIC_ARCHIVE;
if (archive && process.env.GITHUB_ACTIONS === 'true') {
  const expected = fs.readFileSync(`${archive}.sha256`, 'utf8').split(/\s+/)[0];
  const actual = crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
  if (!/^[0-9a-f]{64}$/.test(expected) || expected !== actual) throw new Error('downloaded archive SHA256 differs from build artifact');
}
const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...tests], {
  cwd: root, env: process.env, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
});
const log = `${result.stdout || ''}${result.stderr || ''}${result.error ? `\n${result.error.message}\n` : ''}`;
process.stdout.write(log);
fs.writeFileSync(path.join(output, 'acceptance.tap'), log);
const counts = Object.fromEntries([...log.matchAll(/^# (tests|pass|fail|cancelled|skipped|todo) (\d+)$/gm)]
  .map((match) => [match[1], Number(match[2])]));
const failures = [...log.matchAll(/^\s*not ok \d+ - (.+)$/gm)].map((match) => match[1]);
const summary = { platform: process.platform, commit: process.env.GITHUB_SHA || null, archive: archive || null,
  exit_code: result.status, signal: result.signal, counts, failures };
fs.writeFileSync(path.join(output, 'result.json'), `${JSON.stringify(summary, null, 2)}\n`);
const report = `### AI-SDLC acceptance: ${process.platform}\n\nExit: ${result.status ?? result.signal ?? 'spawn error'}; counts: ${JSON.stringify(counts)}\n\n`
  + (failures.length ? failures.map((name) => `- ${name}`).join('\n') : 'No failed tests reported.')
  + '\n\nThe complete lane runs unchanged. Failures remain failures, including the protected human-authentication criterion awaiting an owner amendment. This advisory workflow is separate from the repository gate.\n';
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
process.exitCode = result.status === 0 ? 0 : result.status || 1;
