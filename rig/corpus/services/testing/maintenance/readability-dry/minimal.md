# testing.maintenance.readability-dry — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for readability dry. It checks scenario_names (nonempty): scenario names must name the concrete repository contract.. Binding checks: readability-dry-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe maintenance.readability-dry; bind it to the input named in `rig-services/testing.maintenance.readability-dry.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside maintenance.readability-dry is a failure.

Acceptance target: fixture:testing.maintenance.readability-dry:policy-boundary. Given source-code is present and maintenance.readability-dry is selected, pass only when the repository binding evaluates maintenance.readability-dry and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Owned scope: `maintenance.readability-dry`.

Offer: Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Input: `rig-services/testing.maintenance.readability-dry.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: readability dry configuration validation only; declared policy does not prove running readability dry behavior. Select an approved repository-owned command to verify that behavior.

minimal: scenario names — ["expired token is rejected"].

mid: shared helpers — ["create valid account"].

maximal: hide assertions in helpers — false.
