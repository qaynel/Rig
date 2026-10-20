# testing.mutation.selector-sampler — behavior-oracle slice

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Assurance remains Policy grade.

The policy oracle for this service is `selector-sampler-slice-behavior-oracle`, and it validates `selection_scope`. A seeded sample can estimate sensitivity but cannot stand in for exhaustive mutation coverage.

A passing result means the input meets this one rule. It does not show the mutation tool or its oracle ran. For that claim, use a repository-owned execution check and report the observed result.
