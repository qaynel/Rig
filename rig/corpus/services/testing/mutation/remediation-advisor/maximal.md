# testing.mutation.remediation-advisor — maximal

Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: remediation-advisor-source-code-boundary, remediation-advisor-mutation-context, remediation-advisor-evidence-receipt.

Keep `add_implementation_mirrors` equal to false. Keep implementation mirrors disabled; a proposed case still needs a reviewer and a test run before it proves coverage.

Maximal here adds a configuration guard, not an evidence receipt or a demonstrated mutation outcome. remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior.

Evidence-replay target (not established by this policy check): policy:testing.mutation.remediation-advisor:maximal:remediation-advisor-source-code-boundary+remediation-advisor-mutation-context+remediation-advisor-evidence-receipt.

Check: `remediation-advisor-evidence-receipt`.
