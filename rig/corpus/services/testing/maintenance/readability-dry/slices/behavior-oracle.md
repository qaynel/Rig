# testing.maintenance.readability-dry — behavior-oracle slice

Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Policy grade slice. This slice bounds readability dry to maintenance.readability-dry. It uses `readability-dry-slice-behavior-oracle` and checks scenario_names (nonempty): scenario names must name the concrete repository contract.