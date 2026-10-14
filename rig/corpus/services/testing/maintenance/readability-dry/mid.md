# testing.maintenance.readability-dry — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for readability dry; it does not widen ownership beyond maintenance.readability-dry. The context signals are shared_helpers. Binding checks: readability-dry-maintenance-context.

Anchor the review on the existing repository's readability dry convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in maintenance under their own verdicts.

Acceptance target: fixture:testing.maintenance.readability-dry:repository-context. Given maintenance.readability-dry has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent maintenance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Owned scope: `maintenance.readability-dry`.

Offer: Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Input: `rig-services/testing.maintenance.readability-dry.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: readability dry configuration validation only; declared policy does not prove running readability dry behavior. Select an approved repository-owned command to verify that behavior.

minimal: scenario names — ["expired token is rejected"].

mid: shared helpers — ["create valid account"].

maximal: hide assertions in helpers — false.
