# testing.regression.suite-curation — property-floor slice

Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Policy grade slice `suite-curation-slice-property-floor`: List the suites kept because they guard live behavior. Without it nothing protects against removal, so name them.
