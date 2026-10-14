# testing.mutation.selector-sampler — maximal

Maximal adds a replayable evidence receipt for selector sampler. The evidence must preserve the selection_scope, sampling_seed, claim_exhaustive_from_sample inputs that determined the result.

Tie acceptance to a second run against unchanged selector sampler inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.selector-sampler:evidence-replay. Given the mutation.selector-sampler binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
