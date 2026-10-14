# selector sampler

Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Owned scope: `mutation.selector-sampler`.

Offer: Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Input: `rig-services/testing.mutation.selector-sampler.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Select an approved repository-owned command to verify that behavior.

minimal: selection scope — ["changed parser functions"].

mid: sampling seed — 42.

maximal: claim exhaustive from sample — false.

