# testing.mutation.survivor-rca — behavior-oracle slice

Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Assurance remains Policy grade.

The policy oracle for this service is `survivor-rca-slice-behavior-oracle`, and it validates `surviving_mutants`. Treat a survivor as a signal for review, not automatically as a defect or as equivalent.

A passing result means the input meets this one rule. It does not show the mutation tool or its oracle ran. For that claim, use a repository-owned execution check and report the observed result.
