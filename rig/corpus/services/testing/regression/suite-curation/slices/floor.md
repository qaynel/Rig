# testing.regression.suite-curation — floor and mutation-floor slice

Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Policy grade slice `suite-curation-slice-floor`: List the suites kept because they guard live behavior. Without it nothing protects against removal, so name them.
