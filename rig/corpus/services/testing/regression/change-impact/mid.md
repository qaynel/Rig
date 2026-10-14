# testing.regression.change-impact — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for change impact; it does not widen ownership beyond regression.change-impact. The context signals are affected_suites. Binding checks: change-impact-regression-context.

Start from the existing repository's change impact convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in regression under their own verdicts.

Acceptance target: fixture:testing.regression.change-impact:repository-context. Given regression.change-impact has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent regression concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Owned scope: `regression.change-impact`.

Offer: Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Input: `rig-services/testing.regression.change-impact.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: change impact configuration validation only; declared policy does not prove running change impact behavior. Select an approved repository-owned command to verify that behavior.

minimal: changed interfaces — ["order serializer"].

mid: affected suites — ["order contract"].

maximal: select by filename only — false.
