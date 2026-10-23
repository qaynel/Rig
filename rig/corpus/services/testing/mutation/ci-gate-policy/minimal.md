# testing.mutation.ci-gate-policy — minimal

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Grade: minimal. Assurance remains Policy grade.

Set `minimum_score_percent` to at least 70. Choose the minimum score before evaluating a run; the example threshold is 70 percent.

Input: `rig-services/testing.mutation.ci-gate-policy.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: Configuration validation only, so it confirms a score threshold, a timeout policy and the unrun-mutant flag are declared; it does not run mutation testing.

Acceptance target: policy:testing.mutation.ci-gate-policy:minimal:ci-gate-policy-source-code-boundary.

Declared predicates: ci-gate-policy-source-code-boundary: `minimum_score_percent` is numeric and at least 70.

Check: `ci-gate-policy-source-code-boundary`.
