# testing.mutation.ci-gate-policy — maximal

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: ci-gate-policy-source-code-boundary, ci-gate-policy-mutation-context, ci-gate-policy-evidence-receipt.

Keep `allow_unrun_mutants` equal to false. Do not allow unrun mutants to pass the gate; configuration alone does not prove the CI job enforces that policy.

Maximal here adds a configuration guard, not an evidence receipt or a demonstrated mutation outcome. ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Select an approved repository-owned command to verify that behavior.

Evidence-replay target (not established by this policy check): policy:testing.mutation.ci-gate-policy:maximal:ci-gate-policy-source-code-boundary+ci-gate-policy-mutation-context+ci-gate-policy-evidence-receipt.

Check: `ci-gate-policy-evidence-receipt`.
