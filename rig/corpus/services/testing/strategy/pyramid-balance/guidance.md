# pyramid-balance

Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Owned scope: `strategy.pyramid-balance`. Input: `rig-services/testing.strategy.pyramid-balance.json`.

Coverage ceiling: Configuration validation only, so it confirms unit suites, integration suites and the e2e-only flag are declared; it does not count tests.

minimal: unit suites — ["parser"]. List the fast local unit suites. Without them diagnosis is slow, so name each suite.

mid: integration suites — ["api database"]. List the focused integration suites above them. A pyramid needs a middle, so name the integration layer.

maximal: e2e only strategy — false. Set e2e-only strategy to false. Relying only on end-to-end tests makes failures slow to diagnose, so keep lower layers.
