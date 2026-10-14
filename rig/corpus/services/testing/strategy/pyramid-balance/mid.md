# testing.strategy.pyramid-balance — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for pyramid balance; it does not widen ownership beyond strategy.pyramid-balance. For pyramid balance, inspect these context signals: integration_suites. Binding checks: pyramid-balance-strategy-context.

Read the existing repository's pyramid balance convention, then name the source path or command that establishes it. For pyramid balance, inspect the repository's actual spec, source, test, or configuration for integration_suites; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring strategy services outside the pyramid balance decision for strategy.pyramid-balance.

Acceptance target: fixture:testing.strategy.pyramid-balance:repository-context. Given strategy.pyramid-balance has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent strategy concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.
minimal: unit suites — ["parser"].
mid: integration suites — ["api database"].
maximal: e2e only strategy — false.
