# testing.mutation.run-reporting — identity

run reporting owns mutation.run-reporting. Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Keep sibling services in mutation under their own verdicts. Tie acceptance to the configured input at `rig-services/testing.mutation.run-reporting.json`; malformed input is still attributed to that path.

Disposition: convention. Read the limit: run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.run-reporting:policy-boundary. Given source-code is present and mutation.run-reporting is selected, pass only when the repository binding evaluates mutation.run-reporting and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.
