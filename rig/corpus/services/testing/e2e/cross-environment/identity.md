# testing.e2e.cross-environment — identity

Policy grade: cross environment owns e2e.cross-environment. Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Keep neighboring e2e services outside the cross environment decision for e2e.cross-environment. Read the configured input at `rig-services/testing.e2e.cross-environment.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: cross environment configuration validation only; declared policy does not prove running cross environment behavior. Choose a repository-owned check that observes cross environment from rig-services/testing.e2e.cross-environment.json.

Acceptance target: fixture:testing.e2e.cross-environment:policy-boundary. Given source-code is present and e2e.cross-environment is selected, pass only when the repository binding evaluates e2e.cross-environment and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern.

Service-specific evidence cues:
Offer: Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.
minimal: environments — ["linux","macos"].
mid: shared cases — ["install and run"].
maximal: assume platform equivalence — false.
