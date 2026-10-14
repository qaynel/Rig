# testing.mutation.survivor-rca — mid

Mid adds repository context for survivor rca; it does not widen ownership beyond mutation.survivor-rca. The context signals are missing_assertions.

Anchor the review on the existing repository's survivor rca convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.survivor-rca:repository-context. Given mutation.survivor-rca has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.
