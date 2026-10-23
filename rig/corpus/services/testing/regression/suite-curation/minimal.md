# testing.regression.suite-curation — minimal

Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Policy grade, minimal: List the suites kept because they guard live behavior. Without it nothing protects against removal, so name them. Binding checks: suite-curation-source-code-boundary.

Acceptance target: policy:testing.regression.suite-curation:minimal:suite-curation-source-code-boundary.
Declared predicates: suite-curation-source-code-boundary: `retained_suites` is nonempty (a string or array).
