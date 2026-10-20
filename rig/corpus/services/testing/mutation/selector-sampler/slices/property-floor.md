# testing.mutation.selector-sampler — property-floor slice

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Assurance remains Policy grade.

This slice verifies the configured `selection_scope` rule using `selector-sampler-slice-property-floor`. Choose a reproducible subset of candidate mutants for a bounded run.

The accepted fixture contains `selection_scope` = `["changed parser functions"]`; the invalid fixture demonstrates the missing-field case. This checks policy shape only, not a property of generated mutants.
