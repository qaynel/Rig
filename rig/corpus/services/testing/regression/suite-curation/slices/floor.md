# testing.regression.suite-curation — floor and mutation-floor slice

Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Policy grade slice. This slice bounds suite curation to regression.suite-curation. It uses `suite-curation-slice-floor` and checks retained_suites (nonempty): retained suites must name the concrete repository contract.