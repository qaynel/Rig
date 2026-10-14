# testing.mutation.selector-sampler — identity

Policy grade: selector sampler owns mutation.selector-sampler. Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Keep neighboring mutation services outside the selector sampler decision for mutation.selector-sampler. Start from the configured input at `rig-services/testing.mutation.selector-sampler.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Choose a repository-owned check that observes selector sampler from rig-services/testing.mutation.selector-sampler.json.

Acceptance target: fixture:testing.mutation.selector-sampler:policy-boundary. Given source-code is present and mutation.selector-sampler is selected, pass only when the repository binding evaluates mutation.selector-sampler and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.

Service-specific evidence cues:
Offer: Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.
minimal: selection scope — ["changed parser functions"].
mid: sampling seed — 42.
maximal: claim exhaustive from sample — false.
