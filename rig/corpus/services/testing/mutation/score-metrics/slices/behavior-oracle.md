# testing.mutation.score-metrics — behavior-oracle slice

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Assurance remains Policy grade.

The policy oracle for this service is `score-metrics-slice-behavior-oracle`, and it validates `killed_mutants`. Including invalid mutants can distort the score without measuring test sensitivity.

A passing result means the input meets this one rule. It does not show the mutation tool or its oracle ran. For that claim, use a repository-owned execution check and report the observed result.
