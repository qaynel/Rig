# testing.mutation.remediation-advisor — minimal

Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Grade: minimal. Assurance remains Policy grade. This check rejects a policy with no remediation_cases: the bad fixture has `remediation_cases` = `[]`, while the accepted fixture has `remediation_cases` = `["reject exact upper limit"]`.

List at least one value for `remediation_cases`. The result says only that the configured operator or input is present. List a concrete remediation case, such as rejecting the exact boundary value that survived.

Input: `rig-services/testing.mutation.remediation-advisor.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: policy:testing.mutation.remediation-advisor:minimal:remediation-advisor-source-code-boundary.

Declared predicates: remediation-advisor-source-code-boundary: `remediation_cases` is nonempty (a string or array).

Check: `remediation-advisor-source-code-boundary`.
