# testing.e2e.cross-environment — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for cross environment. It checks environments (nonempty): environments must name the concrete repository contract.. Binding checks: cross-environment-source-code-boundary.

Use a repository-owned command or existing native check that can observe e2e.cross-environment; bind it to the input named in `rig-services/testing.e2e.cross-environment.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside e2e.cross-environment is a failure.

Acceptance target: fixture:testing.e2e.cross-environment:policy-boundary. Given source-code is present and e2e.cross-environment is selected, pass only when the repository binding evaluates e2e.cross-environment and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Owned scope: `e2e.cross-environment`.

Offer: Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Input: `rig-services/testing.e2e.cross-environment.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: cross environment configuration validation only; declared policy does not prove running cross environment behavior. Select an approved repository-owned command to verify that behavior.

minimal: environments — ["linux","macos"].

mid: shared cases — ["install and run"].

maximal: assume platform equivalence — false.
