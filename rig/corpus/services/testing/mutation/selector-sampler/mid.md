# testing.mutation.selector-sampler — mid

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: selector-sampler-source-code-boundary, selector-sampler-mutation-context.

Set `sampling_seed` to at least 42. Use the same seed and scope when comparing runs; changes to either make samples incomparable.

This remains configuration review. A value in `rig-services/testing.mutation.selector-sampler.json` does not prove the command was run, that its output was correct, or that neighboring mutation stages were covered.

Repository-context target (not established by this policy check): policy:testing.mutation.selector-sampler:mid:selector-sampler-source-code-boundary+selector-sampler-mutation-context.

Check: `selector-sampler-mutation-context`.
