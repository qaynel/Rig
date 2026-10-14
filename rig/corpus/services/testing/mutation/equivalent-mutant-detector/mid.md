# testing.mutation.equivalent-mutant-detector — mid

Mid adds repository context for equivalent mutant detector; it does not widen ownership beyond mutation.equivalent-mutant-detector. The context signals are review_owners.

Ground the decision in the existing repository's equivalent mutant detector convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.equivalent-mutant-detector:repository-context. Given mutation.equivalent-mutant-detector has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.
