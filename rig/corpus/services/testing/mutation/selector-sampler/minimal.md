# testing.mutation.selector-sampler — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for selector sampler. The minimal boundary for selector sampler checks selection_scope (nonempty): selection scope must name the concrete repository contract.. Binding checks: selector-sampler-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe mutation.selector-sampler; bind it to the input named in `rig-services/testing.mutation.selector-sampler.json` and preserve the check's failure status. When adopting this in an existing repository, connect selector sampler to the command that inspects selection_scope and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside mutation.selector-sampler as a failure.

Acceptance target: fixture:testing.mutation.selector-sampler:policy-boundary. Given source-code is present and mutation.selector-sampler is selected, pass only when the repository binding evaluates mutation.selector-sampler and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. The ceiling is selector sampler configuration validation only; declared policy does not prove running selector sampler behavior. Choose a repository-owned check that observes selector sampler from rig-services/testing.mutation.selector-sampler.json..

Service-specific evidence cues:
Offer: Make mutant sampling reproducible and state the selected scope. A sampled run may estimate sensitivity, but it cannot claim exhaustive mutation coverage.
minimal: selection scope — ["changed parser functions"].
mid: sampling seed — 42.
maximal: claim exhaustive from sample — false.
