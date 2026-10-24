# testing.mutation.ci-gate-policy — maximal

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Policy grade, maximal: Set allowing unrun mutants to false. A mutant that never ran is no evidence, so count it as a gap. Cumulative with minimal and mid. Binding checks: ci-gate-policy-source-code-boundary, ci-gate-policy-mutation-context, ci-gate-policy-evidence-receipt.
