# testing.regression.suite-curation — identity

Policy grade: suite-curation owns regression.suite-curation. Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Input: `rig-services/testing.regression.suite-curation.json`. Configuration validation only, so it confirms retained suites, retirement reasons and the no-owner flag are declared; it does not run the suites.

Disposition: executable.
Acceptance target: policy:testing.regression.suite-curation:minimal:suite-curation-source-code-boundary.
Declared predicates: suite-curation-source-code-boundary: `retained_suites` is nonempty (a string or array).
