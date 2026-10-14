# testing.mutation.run-reporting — identity

Policy grade: run reporting owns mutation.run-reporting. Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Keep sibling services in mutation under their own verdicts. Tie acceptance to the configured input at `rig-services/testing.mutation.run-reporting.json`; malformed input is still attributed to that path.

Disposition: convention. Read the limit: run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.run-reporting:policy-boundary. Given source-code is present and mutation.run-reporting is selected, pass only when the repository binding evaluates mutation.run-reporting and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.

Service-specific evidence cues:
Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Owned scope: `mutation.run-reporting`.

Offer: Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Input: `rig-services/testing.mutation.run-reporting.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior.

minimal: reported outcomes — ["killed","survived","timeout"].

mid: input revision — "a1b2c3d".

maximal: publish raw secrets — false.
