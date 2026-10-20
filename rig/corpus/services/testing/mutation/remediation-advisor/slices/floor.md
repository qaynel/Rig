# testing.mutation.remediation-advisor — floor slice

Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Assurance remains Policy grade.

This Policy slice checks `remediation_cases` through `remediation-advisor-slice-floor`. The good fixture supplies `remediation_cases` = `["reject exact upper limit"]`; the bad fixture removes it.

List a concrete remediation case, such as rejecting the exact boundary value that survived. Keep the failure attached to `rig-services/testing.mutation.remediation-advisor.json`; do not infer that a mutation was generated or killed. remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior.
