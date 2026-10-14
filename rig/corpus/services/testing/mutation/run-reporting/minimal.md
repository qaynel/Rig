# testing.mutation.run-reporting — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for run reporting. The minimal boundary for run reporting checks reported_outcomes (nonempty): reported outcomes must name the concrete repository contract.. Binding checks: run-reporting-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe mutation.run-reporting; bind it to the input named in `rig-services/testing.mutation.run-reporting.json` and preserve the check's failure status. When adopting this in an existing repository, connect run reporting to the command that inspects reported_outcomes and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside mutation.run-reporting as a failure.

Acceptance target: fixture:testing.mutation.run-reporting:policy-boundary. Given source-code is present and mutation.run-reporting is selected, pass only when the repository binding evaluates mutation.run-reporting and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. The ceiling is run reporting configuration validation only; declared policy does not prove running run reporting behavior. Choose a repository-owned check that observes run reporting from rig-services/testing.mutation.run-reporting.json..

Service-specific evidence cues:
Offer: Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.
minimal: reported outcomes — ["killed","survived","timeout"].
mid: input revision — "a1b2c3d".
maximal: publish raw secrets — false.
