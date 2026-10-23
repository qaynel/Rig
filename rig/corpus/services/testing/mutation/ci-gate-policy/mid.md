# testing.mutation.ci-gate-policy — mid

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Policy grade, mid: State the policy for timed-out mutants. Without it a timeout silently counts as acceptable, so decide killed, survived or inconclusive. Cumulative with minimal. Binding checks: ci-gate-policy-source-code-boundary, ci-gate-policy-mutation-context.
