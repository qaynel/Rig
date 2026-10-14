# testing.mutation.mutant-generator — mid

Mid adds repository context for mutant generator; it does not widen ownership beyond mutation.mutant-generator. The context signals are target_paths.

Anchor the review on the existing repository's mutant generator convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.mutant-generator:repository-context. Given mutation.mutant-generator has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.
