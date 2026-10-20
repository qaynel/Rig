# testing.regression.snapshot-golden — floor and mutation-floor slice

Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Policy grade slice `snapshot-golden-slice-floor`: List the golden files under test. Unlisted snapshots drift unnoticed, so name each path.
