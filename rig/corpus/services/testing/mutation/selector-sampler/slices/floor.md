# testing.mutation.selector-sampler — floor slice

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Assurance remains Policy grade.

This Policy slice checks `selection_scope` through `selector-sampler-slice-floor`. The good fixture supplies `selection_scope` = `["changed parser functions"]`; the bad fixture removes it.

A nonempty selection scope defines what may be sampled; it does not prove which mutants the sampler selected. Keep the failure attached to `rig-services/testing.mutation.selector-sampler.json`; do not infer that a mutation was generated or killed. selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Select an approved repository-owned command to verify that behavior.
