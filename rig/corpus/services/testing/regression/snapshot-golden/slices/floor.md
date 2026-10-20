# testing.regression.snapshot-golden — floor and mutation-floor slice

Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Policy grade slice. This slice bounds snapshot golden to regression.snapshot-golden. It uses `snapshot-golden-slice-floor` and checks golden_paths (nonempty): golden paths must name the concrete repository contract.