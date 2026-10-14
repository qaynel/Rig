# testing.test-data.synthetic-data — minimal

Minimal establishes a non-vacuous policy boundary for synthetic data. It checks generation_rules (nonempty): generation rules must name the concrete repository contract..

Read a repository-owned command or existing native check that can observe test-data.synthetic-data; bind it to the input named in `rig-services/testing.test-data.synthetic-data.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside test-data.synthetic-data is a failure.

Acceptance target: fixture:testing.test-data.synthetic-data:policy-boundary. Given source-code is present and test-data.synthetic-data is selected, pass only when the repository binding evaluates test-data.synthetic-data and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern. A passing policy check does not establish runtime behavior.
