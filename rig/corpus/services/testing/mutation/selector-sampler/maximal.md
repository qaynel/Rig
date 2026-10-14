# testing.mutation.selector-sampler — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for selector sampler. The evidence must preserve the selection_scope, sampling_seed, claim_exhaustive_from_sample inputs that determined the result. Binding checks: selector-sampler-evidence-receipt.

Tie acceptance to a second run against unchanged selector sampler inputs. Record the selection_scope, sampling_seed, claim_exhaustive_from_sample inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this selector sampler result is stale. The ceiling remains: selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Choose a repository-owned check that observes selector sampler from rig-services/testing.mutation.selector-sampler.json.

Acceptance target: fixture:testing.mutation.selector-sampler:evidence-replay. Given the mutation.selector-sampler binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.
minimal: selection scope — ["changed parser functions"].
mid: sampling seed — 42.
maximal: claim exhaustive from sample — false.
