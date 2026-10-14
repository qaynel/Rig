# testing.mutation.remediation-advisor — identity

remediation advisor owns mutation.remediation-advisor. Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Keep sibling services in mutation under their own verdicts. Use the configured input at `rig-services/testing.mutation.remediation-advisor.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.remediation-advisor:policy-boundary. Given source-code is present and mutation.remediation-advisor is selected, pass only when the repository binding evaluates mutation.remediation-advisor and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.
