# testing.mutation.selector-sampler — mid

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Policy grade, mid: Record the sampling seed, at least 42 as a fixed value. A random draw cannot be rerun, so fix the seed. Cumulative with minimal. Binding checks: selector-sampler-source-code-boundary, selector-sampler-mutation-context.
