# selector sampler

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Assurance remains Policy grade.

Choose a reproducible subset of candidate mutants for a bounded run. A seeded sample can estimate sensitivity but cannot stand in for exhaustive mutation coverage.

The policy input is `rig-services/testing.mutation.selector-sampler.json`. Keep its configuration visible to review: minimal supplies `selection_scope` = `["changed parser functions"]`; mid adds `sampling_seed` = `42`; maximal sets `claim_exhaustive_from_sample` = `false`.


The native check validates this service’s declared policy only; it does not run the service. For runtime assurance, run an approved repository-owned command and preserve its exit status.
