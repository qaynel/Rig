# testing.strategy.pyramid-balance — behavior-oracle slice

Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Policy grade slice `pyramid-balance-slice-behavior-oracle`: List the fast local unit suites. Without them diagnosis is slow, so name each suite. Despite its name this slice is not a behavior oracle: it confirms unit suites, integration suites and the e2e-only flag are declared; it does not count tests.
