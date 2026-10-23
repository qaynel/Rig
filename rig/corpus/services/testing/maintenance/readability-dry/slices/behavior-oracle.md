# testing.maintenance.readability-dry — behavior-oracle slice

Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Policy grade slice `readability-dry-slice-behavior-oracle`: Name scenarios by the behavior they establish. Names like test1 explain nothing on failure, so describe the behavior. Despite its name this slice is not a behavior oracle: it confirms scenario names, shared helpers and the hidden-assertion flag are declared; it does not read the tests.
