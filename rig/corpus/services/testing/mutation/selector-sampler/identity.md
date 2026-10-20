# testing.mutation.selector-sampler — identity

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Policy grade. Choose a reproducible subset of candidate mutants for a bounded run. A seeded sample can estimate sensitivity but cannot stand in for exhaustive mutation coverage.

Applicable surface: source-code.

Owned scope: `mutation.selector-sampler`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Read `rig-services/testing.mutation.selector-sampler.json`; malformed input remains attributable to that path. The good and bad fixtures show the configuration boundary, not a mutation run.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Select an approved repository-owned command to verify that behavior.

Policy checks: minimal requires `selection_scope` = `["changed parser functions"]`; mid adds `sampling_seed` = `42`; maximal requires `claim_exhaustive_from_sample` = `false`.
