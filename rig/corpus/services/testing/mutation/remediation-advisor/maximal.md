# testing.mutation.remediation-advisor — maximal

Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Policy grade, maximal: Set adding implementation mirrors to false. A test that copies the implementation passes with the bug, so assert behavior instead. Cumulative with minimal and mid. Binding checks: remediation-advisor-source-code-boundary, remediation-advisor-mutation-context, remediation-advisor-evidence-receipt.
