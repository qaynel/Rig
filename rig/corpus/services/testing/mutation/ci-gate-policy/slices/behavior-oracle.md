# testing.mutation.ci-gate-policy — behavior-oracle slice

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Assurance remains Policy grade.

The policy oracle for this service is `ci-gate-policy-slice-behavior-oracle`, and it validates `minimum_score_percent`. Timeouts and unrun mutants cannot silently count as acceptable evidence.

A passing result means the input meets this one rule. It does not show the mutation tool or its oracle ran. For that claim, use a repository-owned execution check and report the observed result.
