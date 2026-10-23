# testing.strategy.pyramid-balance — floor and mutation-floor slice

Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Policy grade slice `pyramid-balance-slice-floor`: List the fast local unit suites. Without them diagnosis is slow, so name each suite.
