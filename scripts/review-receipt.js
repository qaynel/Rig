#!/usr/bin/env node
'use strict';

// AD-29 review wrapper.
//
// Invokes a reviewer non-interactively under an explicit model and writes the
// receipt itself. The reviewing agent contributes `findings` and nothing else:
// it never authors the model id, the digest, or the timestamp, because those
// are the fields that certify its own independence.
//
//   node scripts/review-receipt.js --target <file> --model <id> --out <receipt>
//
// AT-GATE-3 additionally requires a different model than the authoring context.
// For a Gate 2 target the authoring model is declared in the document header;
// this script reads it and refuses to run under the same one.

const { createHash } = require('node:crypto');
const { readFileSync, writeFileSync } = require('node:fs');
const { spawnSync } = require('node:child_process');

const WRAPPER_VERSION = 1;
const TIMEOUT_MS = 30 * 60 * 1000;

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? null : process.argv[i + 1];
}

function fail(message) {
  console.error(`review-receipt: ${message}`);
  process.exit(1);
}

const targetPath = arg('target') || fail('--target is required');
const model = arg('model') || fail('--model is required');
const outPath = arg('out') || fail('--out is required');
const gate1Paths = (arg('gate1') || '').split(',').filter(Boolean);

const targetBytes = readFileSync(targetPath);
const targetDigest = createHash('sha256').update(targetBytes).digest('hex');

// Refuse a same-model review. The authoring model is self-declared in the
// document, which is the one asserted link in this chain (recorded as a
// residual risk in the Gate 2 header), but a declared value we can read is
// still worth enforcing against.
const authoring = /Authored by `([^`]+)`/.exec(targetBytes.toString('utf8'));
if (authoring && authoring[1] === model) {
  fail(`refusing same-model review: target declares authoring model ${authoring[1]}`);
}

const gate1 = gate1Paths.map((p) => ({
  path: p,
  digest: createHash('sha256').update(readFileSync(p)).digest('hex'),
  text: readFileSync(p, 'utf8'),
}));

const prompt = `You are performing a REPORT-ONLY specification review. You have no
authority to edit anything and must not attempt to. Report findings only.

You are reviewing a Gate 2 technical specification against its frozen Gate 1
(business intent plus acceptance criteria). The governing acceptance case is:

  AT-GATE-3: every Gate-1 rule must have one testable implementation contract,
  and no two clauses may prescribe incompatible outcomes.

Judge these questions, in this order of importance:

1. COVERAGE. Is there any Gate-1 rule or acceptance case with no corresponding
   mechanism in Gate 2, or one so vague it could not be tested?
2. CONTRADICTION. Do any two Gate 2 clauses prescribe incompatible outcomes?
   Does any Gate 2 clause contradict Gate 1?
3. TESTABILITY. Is any traceability row's "primary executable evidence" a
   tautology, a presence check, or otherwise unable to fail for the right
   reason?
4. PLACEHOLDERS. Any unresolved marker, TODO, TBD, or hand-wave standing where a
   mechanism is required.
5. OVERREACH. Any mechanism Gate 2 invents that Gate 1 does not require and that
   adds risk or machinery for no acceptance-case reason.

Be adversarial and specific. A finding that names a section and quotes the
offending text is useful; a general impression is not. If the specification is
sound on a dimension, say so rather than inventing a finding.

Reply with ONE fenced json block and nothing else, in this exact shape:

\`\`\`json
{
  "verdict": "pass" | "fail",
  "findings": [
    {
      "severity": "blocker" | "major" | "minor",
      "category": "coverage" | "contradiction" | "testability" | "placeholder" | "overreach",
      "anchor": "<section or AD id>",
      "detail": "<what is wrong and why it matters>"
    }
  ],
  "unresolved": ["<gate 1 id with no adequate contract>"]
}
\`\`\`

"verdict" is "fail" if any blocker exists or "unresolved" is non-empty.

===== GATE 1 =====
${gate1.map((g) => `--- ${g.path} ---\n${g.text}`).join('\n\n')}

===== GATE 2 (under review) =====
${targetBytes.toString('utf8')}
`;

const run = spawnSync('claude', ['-p', '--model', model], {
  input: prompt,
  encoding: 'utf8',
  timeout: TIMEOUT_MS,
  maxBuffer: 64 * 1024 * 1024,
});

if (run.error) fail(`reviewer failed to launch: ${run.error.message}`);
if (run.status !== 0) fail(`reviewer exited ${run.status}: ${(run.stderr || '').slice(0, 2000)}`);

const block = /```json\s*([\s\S]*?)```/.exec(run.stdout || '');
if (!block) fail('reviewer produced no json block');

let reported;
try {
  reported = JSON.parse(block[1]);
} catch (e) {
  fail(`reviewer json did not parse: ${e.message}`);
}

// The receipt is assembled here. Only `verdict`, `findings` and `unresolved`
// come from the reviewer; everything else is observed by this process.
writeFileSync(
  outPath,
  `${JSON.stringify(
    {
      schema_version: 1,
      wrapper_version: WRAPPER_VERSION,
      kind: 'report-only-review',
      target: targetPath,
      target_digest: targetDigest,
      gate1: gate1.map(({ path, digest }) => ({ path, digest })),
      reviewer_model: model,
      authoring_model: authoring ? authoring[1] : null,
      reviewed_at: new Date().toISOString(),
      verdict: reported.verdict,
      findings: reported.findings || [],
      unresolved: reported.unresolved || [],
    },
    null,
    2
  )}\n`
);

const findings = reported.findings || [];
const blockers = findings.filter((f) => f.severity === 'blocker').length;
console.log(
  `review-receipt: ${outPath}\n` +
    `  target   ${targetPath} (${targetDigest.slice(0, 12)})\n` +
    `  reviewer ${model}\n` +
    `  verdict  ${reported.verdict} — ${findings.length} finding(s), ${blockers} blocker(s), ` +
    `${(reported.unresolved || []).length} unresolved`
);
