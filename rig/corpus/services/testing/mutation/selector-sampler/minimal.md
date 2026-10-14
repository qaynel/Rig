# testing.mutation.selector-sampler — minimal

Minimal establishes a non-vacuous policy boundary for selector sampler. It checks selection_scope (nonempty): selection scope must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe mutation.selector-sampler; bind it to the input named in `rig-services/testing.mutation.selector-sampler.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.selector-sampler is a failure.

Acceptance target: fixture:testing.mutation.selector-sampler:policy-boundary. Given source-code is present and mutation.selector-sampler is selected, pass only when the repository binding evaluates mutation.selector-sampler and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.
