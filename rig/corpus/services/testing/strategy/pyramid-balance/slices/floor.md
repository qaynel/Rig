# testing.strategy.pyramid-balance — floor and mutation-floor slice

Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Policy grade slice. This slice bounds pyramid balance to strategy.pyramid-balance. It uses `pyramid-balance-slice-floor` and checks unit_suites (nonempty): unit suites must name the concrete repository contract.