# testing.mutation.selector-sampler — maximal

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: selector-sampler-source-code-boundary, selector-sampler-mutation-context, selector-sampler-evidence-receipt.

Keep `claim_exhaustive_from_sample` equal to false. Keep the no-exhaustive-claim guard with the sample policy; only a full run can support an exhaustive result.

Maximal here adds a configuration guard, not an evidence receipt or a demonstrated mutation outcome. selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Select an approved repository-owned command to verify that behavior.

Evidence-replay target (not established by this policy check): policy:testing.mutation.selector-sampler:maximal:selector-sampler-source-code-boundary+selector-sampler-mutation-context+selector-sampler-evidence-receipt.

Check: `selector-sampler-evidence-receipt`.
