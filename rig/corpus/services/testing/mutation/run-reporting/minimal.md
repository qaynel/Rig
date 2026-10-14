# testing.mutation.run-reporting — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for run reporting. It checks reported_outcomes (nonempty): reported outcomes must name the concrete repository contract.. Binding checks: run-reporting-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe mutation.run-reporting; bind it to the input named in `rig-services/testing.mutation.run-reporting.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.run-reporting is a failure.

Acceptance target: fixture:testing.mutation.run-reporting:policy-boundary. Given source-code is present and mutation.run-reporting is selected, pass only when the repository binding evaluates mutation.run-reporting and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Owned scope: `mutation.run-reporting`.

Offer: Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Input: `rig-services/testing.mutation.run-reporting.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior.

minimal: reported outcomes — ["killed","survived","timeout"].

mid: input revision — "a1b2c3d".

maximal: publish raw secrets — false.
