# testing.maintenance.readability-dry — behavior-oracle slice

Policy grade slice. This slice bounds readability dry to maintenance.readability-dry. It uses `readability-dry-slice-behavior-oracle` and checks scenario_names (nonempty): scenario names must name the concrete repository contract..

For readability dry, choose a repository example that satisfies scenario_names at the behavior-oracle floor, plus a failure where scenario names must name the concrete repository contract. is false. For readability dry, wire `behavior-oracle` to `rig-services/testing.maintenance.readability-dry.json` and keep its verdict on scenario_names; missing evidence is a named gap, with ceiling readability dry configuration validation only; declared policy does not prove running readability dry behavior. Choose a repository-owned check that observes readability dry from rig-services/testing.maintenance.readability-dry.json..

Service-specific evidence cues:
Offer: Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.
minimal: scenario names — ["expired token is rejected"].
mid: shared helpers — ["create valid account"].
maximal: hide assertions in helpers — false.
