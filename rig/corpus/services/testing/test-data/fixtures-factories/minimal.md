# testing.test-data.fixtures-factories — minimal

Minimal establishes a non-vacuous policy boundary for fixtures factories. It checks fixture_defaults (nonempty): fixture defaults must name the concrete repository contract..

Start from a repository-owned command or existing native check that can observe test-data.fixtures-factories; bind it to the input named in `rig-services/testing.test-data.fixtures-factories.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside test-data.fixtures-factories is a failure.

Acceptance target: fixture:testing.test-data.fixtures-factories:policy-boundary. Given source-code is present and test-data.fixtures-factories is selected, pass only when the repository binding evaluates test-data.fixtures-factories and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern. A passing policy check does not establish runtime behavior.
