# testing.strategy.pyramid-balance — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for pyramid balance; it does not widen ownership beyond strategy.pyramid-balance. The context signals are integration_suites. Binding checks: pyramid-balance-strategy-context.

Read the existing repository's pyramid balance convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in strategy under their own verdicts.

Acceptance target: fixture:testing.strategy.pyramid-balance:repository-context. Given strategy.pyramid-balance has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent strategy concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Owned scope: `strategy.pyramid-balance`.

Offer: Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Input: `rig-services/testing.strategy.pyramid-balance.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: pyramid balance configuration validation only; declared policy does not prove running pyramid balance behavior. Select an approved repository-owned command to verify that behavior.

minimal: unit suites — ["parser"].

mid: integration suites — ["api database"].

maximal: e2e only strategy — false.
