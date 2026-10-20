# testing.mutation.equivalent-mutant-detector — behavior-oracle slice

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Assurance remains Policy grade.

The policy oracle for this service is `equivalent-mutant-detector-slice-behavior-oracle`, and it validates `equivalence_evidence`. A surviving mutant may expose a missing assertion; survival alone is not an equivalence proof.

A passing result means the input meets this one rule. It does not show the mutation tool or its oracle ran. For that claim, use a repository-owned execution check and report the observed result.
