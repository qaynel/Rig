# testing.mutation.remediation-advisor — minimal

Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Grade: minimal. Assurance remains Policy grade.

List a concrete remediation case, such as rejecting the exact boundary value that survived.

Input: `rig-services/testing.mutation.remediation-advisor.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: Configuration validation only, so it confirms remediation cases, target behaviors and the implementation-mirror flag are declared; it does not write tests.

Acceptance target: policy:testing.mutation.remediation-advisor:minimal:remediation-advisor-source-code-boundary.

Declared predicates: remediation-advisor-source-code-boundary: `remediation_cases` is nonempty (a string or array).

Check: `remediation-advisor-source-code-boundary`.
