'use strict';
// Positive fixture adapter. Negative approval cases call the production API
// directly; every positive launch goes through a real fixture SSH signature.
const lint = require('../../rig/lib/lint-format');
const { approved, sign } = require('./task-approval');
function runReadOnly(target, commands) {
  let auth;
  try { auth = approved(target, commands); } catch { return { status: 'boundary_violation', changed_paths: [] }; }
  return lint.runReadOnly(target, commands, auth);
}
function runGrade(input) {
  if (!input.target || !Array.isArray(input.commands) || !input.commands.length) return lint.runGrade(input);
  let auth;
  try { auth = approved(input.target, input.commands, input.grade === 'maximal' ? 2 : 1); }
  catch { return { status: 'boundary_violation', verdict: 'fail', completed_grades: [] }; }
  return lint.runGrade({ ...input, ...auth });
}
function runCommand(argv, options) {
  options = { ...options, target: options.target || options.cwd };
  const command = { argv, cwd: options.cwd || '.', network: options.network === true,
    ...(options.timeoutMs != null ? { timeout_ms: options.timeoutMs } : {}),
    ...(options.memoryLimitMb != null ? { memory_limit_mb: options.memoryLimitMb } : {}),
    ...(options.maxOutputBytes != null ? { max_output_bytes: options.maxOutputBytes } : {}),
    ...(options.dependencies ? { dependencies: options.dependencies } : {}),
    ...(options.cancelled != null ? { cancelled: options.cancelled } : {}),
  };
  // Command cwd in fixtures is absolute; public plans use a repository-relative cwd.
  command.cwd = require('node:path').relative(options.target, command.cwd) || '.';
  const auth = approved(options.target, [command]);
  const authorized = require('../../rig/lib/task-consent').authorizeCommands(options.target, [command], auth);
  return lint.runCommand(argv, { ...options, permit: authorized.permit });
}
function applyCoverage(target, plan, approval) {
  if (!approval) return lint.applyCoverage(target, plan, approval);
  const challenge = lint.createCoverageApprovalChallenge(target, plan);
  const signed = sign(target, { plan_digest: challenge.plan_digest }, 'rig-coverage-approval', challenge.message);
  return lint.applyCoverage(target, plan, { ...signed, kind: 'coverage-approval' });
}
module.exports = { runReadOnly, runGrade, runCommand, applyCoverage };
