# testing.regression.suite-curation — behavior-oracle slice

Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Policy grade slice `suite-curation-slice-behavior-oracle`: List the suites kept because they guard live behavior. Without it nothing protects against removal, so name them. Despite its name this slice is not a behavior oracle: it confirms retained suites, retirement reasons and the no-owner flag are declared; it does not run the suites.
