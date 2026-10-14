# testing.maintenance.readability-dry — identity

Policy grade: readability dry owns maintenance.readability-dry. Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Keep sibling services in maintenance under their own verdicts. Use the configured input at `rig-services/testing.maintenance.readability-dry.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: readability dry configuration validation only; declared policy does not prove running readability dry behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.maintenance.readability-dry:policy-boundary. Given source-code is present and maintenance.readability-dry is selected, pass only when the repository binding evaluates maintenance.readability-dry and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern.

Service-specific evidence cues:
Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Owned scope: `maintenance.readability-dry`.

Offer: Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Input: `rig-services/testing.maintenance.readability-dry.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: readability dry configuration validation only; declared policy does not prove running readability dry behavior. Select an approved repository-owned command to verify that behavior.

minimal: scenario names — ["expired token is rejected"].

mid: shared helpers — ["create valid account"].

maximal: hide assertions in helpers — false.
