# testing.mutation.selector-sampler — maximal

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Policy grade, maximal: Set claiming exhaustive coverage from a sample to false. A sample estimates sensitivity only, so state it as a sample. Cumulative with minimal and mid. Binding checks: selector-sampler-source-code-boundary, selector-sampler-mutation-context, selector-sampler-evidence-receipt.
