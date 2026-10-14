# testing.regression.suite-curation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for suite curation. The minimal boundary for suite curation checks retained_suites (nonempty): retained suites must name the concrete repository contract.. Binding checks: suite-curation-source-code-boundary.

Use a repository-owned command or existing native check that can observe regression.suite-curation; bind it to the input named in `rig-services/testing.regression.suite-curation.json` and preserve the check's failure status. When adopting this in an existing repository, connect suite curation to the command that inspects retained_suites and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside regression.suite-curation as a failure.

Acceptance target: fixture:testing.regression.suite-curation:policy-boundary. Given source-code is present and regression.suite-curation is selected, pass only when the repository binding evaluates regression.suite-curation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent regression concern. The ceiling is suite curation configuration validation only; declared policy does not prove running suite curation behavior. Choose a repository-owned check that observes suite curation from rig-services/testing.regression.suite-curation.json..

Service-specific evidence cues:
Offer: Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.
minimal: retained suites — ["critical regression"].
mid: retirement reasons — ["obsolete API removed"].
maximal: remove without behavior owner — false.
