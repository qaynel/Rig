# testing.regression.suite-curation — identity

Policy grade: suite curation owns regression.suite-curation. Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Keep neighboring regression services outside the suite curation decision for regression.suite-curation. Read the configured input at `rig-services/testing.regression.suite-curation.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: suite curation configuration validation only; declared policy does not prove running suite curation behavior. Choose a repository-owned check that observes suite curation from rig-services/testing.regression.suite-curation.json.

Acceptance target: policy:testing.regression.suite-curation:minimal:suite-curation-source-code-boundary.

Declared predicates: suite-curation-source-code-boundary: `retained_suites` is nonempty (a string or array).
