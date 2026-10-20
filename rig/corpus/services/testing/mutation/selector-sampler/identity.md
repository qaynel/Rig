# testing.mutation.selector-sampler — identity

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Policy grade. Choose a reproducible subset of candidate mutants for a bounded run. A seeded sample can estimate sensitivity but cannot stand in for exhaustive mutation coverage.

Applicable surface: source-code.

Owned scope: `mutation.selector-sampler`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. Configuration validation only, so it confirms a selection scope, sampling seed and the exhaustive-claim flag are declared; it does not sample mutants.

Policy checks: minimal requires `selection_scope` = `["changed parser functions"]`; mid adds `sampling_seed` = `42`; maximal requires `claim_exhaustive_from_sample` = `false`.
