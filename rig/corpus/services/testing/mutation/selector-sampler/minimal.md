# testing.mutation.selector-sampler — minimal

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Grade: minimal. Assurance remains Policy grade.

A nonempty selection scope defines what may be sampled; it does not prove which mutants the sampler selected.

Input: `rig-services/testing.mutation.selector-sampler.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: Configuration validation only, so it confirms a selection scope, sampling seed and the exhaustive-claim flag are declared; it does not sample mutants.

Acceptance target: policy:testing.mutation.selector-sampler:minimal:selector-sampler-source-code-boundary.

Declared predicates: selector-sampler-source-code-boundary: `selection_scope` is nonempty (a string or array).

Check: `selector-sampler-source-code-boundary`.
