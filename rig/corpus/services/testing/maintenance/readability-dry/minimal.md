# testing.maintenance.readability-dry — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for readability dry. The minimal boundary for readability dry checks scenario_names (nonempty): scenario names must name the concrete repository contract.. Binding checks: readability-dry-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe maintenance.readability-dry; bind it to the input named in `rig-services/testing.maintenance.readability-dry.json` and preserve the check's failure status. When adopting this in an existing repository, connect readability dry to the command that inspects scenario_names and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside maintenance.readability-dry as a failure.

Acceptance target: fixture:testing.maintenance.readability-dry:policy-boundary. Given source-code is present and maintenance.readability-dry is selected, pass only when the repository binding evaluates maintenance.readability-dry and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern. The ceiling is readability dry configuration validation only; declared policy does not prove running readability dry behavior. Choose a repository-owned check that observes readability dry from rig-services/testing.maintenance.readability-dry.json..

Service-specific evidence cues:
Offer: Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.
minimal: scenario names — ["expired token is rejected"].
mid: shared helpers — ["create valid account"].
maximal: hide assertions in helpers — false.
