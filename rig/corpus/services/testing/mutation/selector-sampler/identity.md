# testing.mutation.selector-sampler — identity

Policy grade: selector sampler owns mutation.selector-sampler. Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Keep sibling services in mutation under their own verdicts. Start from the configured input at `rig-services/testing.mutation.selector-sampler.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.selector-sampler:policy-boundary. Given source-code is present and mutation.selector-sampler is selected, pass only when the repository binding evaluates mutation.selector-sampler and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.

Service-specific evidence cues:
Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Owned scope: `mutation.selector-sampler`.

Offer: Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Input: `rig-services/testing.mutation.selector-sampler.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Select an approved repository-owned command to verify that behavior.

minimal: selection scope — ["changed parser functions"].

mid: sampling seed — 42.

maximal: claim exhaustive from sample — false.
