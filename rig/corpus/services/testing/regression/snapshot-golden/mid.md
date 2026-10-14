# testing.regression.snapshot-golden — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for snapshot golden; it does not widen ownership beyond regression.snapshot-golden. The context signals are reviewed_diffs. Binding checks: snapshot-golden-regression-context.

Inspect the existing repository's snapshot golden convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in regression under their own verdicts.

Acceptance target: fixture:testing.regression.snapshot-golden:repository-context. Given regression.snapshot-golden has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent regression concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Owned scope: `regression.snapshot-golden`.

Offer: Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Input: `rig-services/testing.regression.snapshot-golden.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Select an approved repository-owned command to verify that behavior.

minimal: golden paths — ["fixtures/order.json"].

mid: reviewed diffs — ["field addition"].

maximal: automatic snapshot acceptance — false.
