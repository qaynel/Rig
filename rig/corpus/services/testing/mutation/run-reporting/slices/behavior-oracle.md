# testing.mutation.run-reporting — behavior-oracle slice

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Assurance remains Policy grade.

The policy oracle for this service is `run-reporting-slice-behavior-oracle`, and it validates `reported_outcomes`. Raw secrets in mutation inputs or output must not leave the producing environment.

A passing result means the input meets this one rule. It does not show the mutation tool or its oracle ran. For that claim, use a repository-owned execution check and report the observed result.
