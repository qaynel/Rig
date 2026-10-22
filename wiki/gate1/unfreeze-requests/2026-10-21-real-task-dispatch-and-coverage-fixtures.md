# Fixture amendment: real signed task dispatch and durable coverage

Owner request: resolve the existing eighteen findings and rerun their acceptance criteria; provide human-only signing commands. No product criterion changes.

Evidence: `node --test tests/remediation-task-acceptance.test.js` initially failed four cases because unsigned runReadOnly/runGrade executed, approved scripts could drift, applyCoverage accepted a public digest, and mixed invalid maps partially launched. The focused four now pass with the stricter implementation. Existing frozen positive task fixtures invoke runGrade/runReadOnly without signatures; AT-LF-6 supplies a digest-only coverage approval. Those fixture mechanisms contradict AT-LF-5/6's existing authority requirements.

Requested change: positive executable oracle fixtures use isolated real SSHSIG approvals over their exact actual commands/replay and coverage plans. Existing negative assertions stay negative and new direct-seam regressions prove unapproved dispatch still refuses. Coverage positives assert durable on-disk pending/applied records rather than accepting a returned-only array. No acceptance/business documents or case IDs change; no human signing key is available to or used by the agent.

Affected frozen file: tests/advanced-oracle.test.js. New fixture helper tests/helpers/approved-lint.js delegates to the real fixture signer tests/helpers/task-approval.js; neither invokes the owner's signing ceremony. Other non-frozen regression fixtures adapt to actual scope/approval semantics as necessary.

After reviewing the concrete diff, the key holder runs `node scripts/approve-gate1.js` (the first call refuses before signing and prints the exact digest delta), checks its proposed digest delta, then runs the exact `--confirm-digest-delta` command that it prints. The agent cannot perform that human action.
