# testing.mutation.selector-sampler — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for selector sampler; it does not widen ownership beyond mutation.selector-sampler. The context signals are sampling_seed. Binding checks: selector-sampler-mutation-context.

Inspect the existing repository's selector sampler convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.selector-sampler:repository-context. Given mutation.selector-sampler has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Owned scope: `mutation.selector-sampler`.

Offer: Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.

Input: `rig-services/testing.mutation.selector-sampler.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Select an approved repository-owned command to verify that behavior.

minimal: selection scope — ["changed parser functions"].

mid: sampling seed — 42.

maximal: claim exhaustive from sample — false.
