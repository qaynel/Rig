# testing.mutation.mutant-generator — behavior-oracle slice

Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Assurance remains Policy grade.

The policy oracle for this service is `mutant-generator-slice-behavior-oracle`, and it validates `mutation_operators`. Changing a test instead of production code can make a weak oracle appear sensitive.

A passing result means the input meets this one rule. It does not show the mutation tool or its oracle ran. For that claim, use a repository-owned execution check and report the observed result.
