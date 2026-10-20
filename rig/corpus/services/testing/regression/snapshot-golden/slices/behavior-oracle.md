# testing.regression.snapshot-golden — behavior-oracle slice

Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Policy grade slice `snapshot-golden-slice-behavior-oracle`: List the golden files under test. Unlisted snapshots drift unnoticed, so name each path. Despite its name this slice is not a behavior oracle: it confirms golden paths, reviewed diffs and the auto-accept flag are declared; it does not compare snapshots.
