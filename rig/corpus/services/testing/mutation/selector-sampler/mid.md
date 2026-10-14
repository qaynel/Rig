# testing.mutation.selector-sampler — mid

Mid adds repository context for selector sampler; it does not widen ownership beyond mutation.selector-sampler. The context signals are sampling_seed.

Inspect the existing repository's selector sampler convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.selector-sampler:repository-context. Given mutation.selector-sampler has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.
