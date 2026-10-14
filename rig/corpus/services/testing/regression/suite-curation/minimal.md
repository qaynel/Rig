# testing.regression.suite-curation — minimal

Minimal establishes a non-vacuous policy boundary for suite curation. It checks retained_suites (nonempty): retained suites must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe regression.suite-curation; bind it to the input named in `rig-services/testing.regression.suite-curation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside regression.suite-curation is a failure.

Acceptance target: fixture:testing.regression.suite-curation:policy-boundary. Given source-code is present and regression.suite-curation is selected, pass only when the repository binding evaluates regression.suite-curation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent regression concern. A passing policy check does not establish runtime behavior.
