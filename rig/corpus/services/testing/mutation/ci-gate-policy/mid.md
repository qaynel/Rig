# testing.mutation.ci-gate-policy — mid

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: ci-gate-policy-source-code-boundary, ci-gate-policy-mutation-context.

List at least one value for `timeout_policy`. State whether timeout and infrastructure failures fail the gate or require a visible retry.

This remains configuration review. A value in `rig-services/testing.mutation.ci-gate-policy.json` does not prove the command was run, that its output was correct, or that neighboring mutation stages were covered.

Repository-context target (not established by this policy check): policy:testing.mutation.ci-gate-policy:mid:ci-gate-policy-source-code-boundary+ci-gate-policy-mutation-context.

Check: `ci-gate-policy-mutation-context`.
