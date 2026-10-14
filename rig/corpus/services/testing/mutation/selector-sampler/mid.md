# testing.mutation.selector-sampler — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for selector sampler; it does not widen ownership beyond mutation.selector-sampler. For selector sampler, inspect these context signals: sampling_seed. Binding checks: selector-sampler-mutation-context.

Inspect the existing repository's selector sampler convention, then name the source path or command that establishes it. For selector sampler, inspect the repository's actual spec, source, test, or configuration for sampling_seed; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring mutation services outside the selector sampler decision for mutation.selector-sampler.

Acceptance target: fixture:testing.mutation.selector-sampler:repository-context. Given mutation.selector-sampler has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.
minimal: selection scope — ["changed parser functions"].
mid: sampling seed — 42.
maximal: claim exhaustive from sample — false.
