# testing.mutation.selector-sampler — minimal

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Grade: minimal. Assurance remains Policy grade. This check rejects a policy with no selection_scope: the bad fixture has `selection_scope` = `[]`, while the accepted fixture has `selection_scope` = `["changed parser functions"]`.

List at least one value for `selection_scope`. The result says only that the configured operator or input is present. A nonempty selection scope defines what may be sampled; it does not prove which mutants the sampler selected.

Input: `rig-services/testing.mutation.selector-sampler.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: policy:testing.mutation.selector-sampler:minimal:selector-sampler-source-code-boundary.

Declared predicates: selector-sampler-source-code-boundary: `selection_scope` is nonempty (a string or array).

Check: `selector-sampler-source-code-boundary`.
