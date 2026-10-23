# testing.mutation.selector-sampler — floor slice

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Assurance remains Policy grade.

A nonempty selection scope defines what may be sampled; it does not prove which mutants the sampler selected. Configuration validation only, so it confirms a selection scope, sampling seed and the exhaustive-claim flag are declared; it does not sample mutants.
