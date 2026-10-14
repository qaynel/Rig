# testing.maintenance.readability-dry — identity

Policy grade: readability dry owns maintenance.readability-dry. Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Keep neighboring maintenance services outside the readability dry decision for maintenance.readability-dry. Use the configured input at `rig-services/testing.maintenance.readability-dry.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: readability dry configuration validation only; declared policy does not prove running readability dry behavior. Choose a repository-owned check that observes readability dry from rig-services/testing.maintenance.readability-dry.json.

Acceptance target: fixture:testing.maintenance.readability-dry:policy-boundary. Given source-code is present and maintenance.readability-dry is selected, pass only when the repository binding evaluates maintenance.readability-dry and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern.

Service-specific evidence cues:
Offer: Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.
minimal: scenario names — ["expired token is rejected"].
mid: shared helpers — ["create valid account"].
maximal: hide assertions in helpers — false.
