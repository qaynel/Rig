# testing.regression.suite-curation — minimal

Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for suite curation. The minimal boundary for suite curation checks retained_suites (nonempty): retained suites must name the concrete repository contract. Binding checks: suite-curation-source-code-boundary.

Use a repository-owned command or existing native check that can observe regression.suite-curation; bind it to the input named in `rig-services/testing.regression.suite-curation.json` and preserve the check's failure status. When adopting this in an existing repository, connect suite curation to the command that inspects retained_suites and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside regression.suite-curation as a failure.

Acceptance target: policy:testing.regression.suite-curation:minimal:suite-curation-source-code-boundary.

Declared predicates: suite-curation-source-code-boundary: `retained_suites` is nonempty (a string or array).
