# testing.mutation.selector-sampler — behavior-oracle slice

Policy grade slice. This slice bounds selector sampler to mutation.selector-sampler. It uses `selector-sampler-slice-behavior-oracle` and checks selection_scope (nonempty): selection scope must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.selector-sampler.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Owned scope: `mutation.selector-sampler`.

Offer: Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Input: `rig-services/testing.mutation.selector-sampler.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Select an approved repository-owned command to verify that behavior.

minimal: selection scope — ["changed parser functions"].

mid: sampling seed — 42.

maximal: claim exhaustive from sample — false.
