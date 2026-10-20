# testing.mutation.remediation-advisor — behavior-oracle slice

Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Assurance remains Policy grade.

The policy oracle for this service is `remediation-advisor-slice-behavior-oracle`, and it validates `remediation_cases`. An assertion that copies the implementation logic may preserve the same bug.

A passing result means the input meets this one rule. It does not show the mutation tool or its oracle ran. For that claim, use a repository-owned execution check and report the observed result.
