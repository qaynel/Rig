# testing.maintenance.readability-dry — floor and mutation-floor slice

Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Policy grade slice `readability-dry-slice-floor`: Name scenarios by the behavior they establish. Names like test1 explain nothing on failure, so describe the behavior.
