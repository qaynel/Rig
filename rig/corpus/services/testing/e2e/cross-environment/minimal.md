# testing.e2e.cross-environment — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for cross environment. The minimal boundary for cross environment checks environments (nonempty): environments must name the concrete repository contract.. Binding checks: cross-environment-source-code-boundary.

Use a repository-owned command or existing native check that can observe e2e.cross-environment; bind it to the input named in `rig-services/testing.e2e.cross-environment.json` and preserve the check's failure status. When adopting this in an existing repository, connect cross environment to the command that inspects environments and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside e2e.cross-environment as a failure.

Acceptance target: fixture:testing.e2e.cross-environment:policy-boundary. Given source-code is present and e2e.cross-environment is selected, pass only when the repository binding evaluates e2e.cross-environment and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern. The ceiling is cross environment configuration validation only; declared policy does not prove running cross environment behavior. Choose a repository-owned check that observes cross environment from rig-services/testing.e2e.cross-environment.json..

Service-specific evidence cues:
Offer: Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.
minimal: environments — ["linux","macos"].
mid: shared cases — ["install and run"].
maximal: assume platform equivalence — false.
