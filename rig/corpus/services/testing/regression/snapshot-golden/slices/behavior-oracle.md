# testing.regression.snapshot-golden — behavior-oracle slice

Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Policy grade slice. This slice bounds snapshot golden to regression.snapshot-golden. It uses `snapshot-golden-slice-behavior-oracle` and checks golden_paths (nonempty): golden paths must name the concrete repository contract.