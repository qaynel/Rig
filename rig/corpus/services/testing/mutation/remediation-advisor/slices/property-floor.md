# testing.mutation.remediation-advisor — property-floor slice

Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Assurance remains Policy grade.

This slice verifies the configured `remediation_cases` rule using `remediation-advisor-slice-property-floor`. Propose behavior-level tests that would distinguish a survived mutation.

The accepted fixture contains `remediation_cases` = `["reject exact upper limit"]`; the invalid fixture demonstrates the missing-field case. This checks policy shape only, not a property of generated mutants.
