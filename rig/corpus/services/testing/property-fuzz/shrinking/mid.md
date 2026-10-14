# testing.property-fuzz.shrinking — mid

Mid adds repository context for shrinking; it does not widen ownership beyond property-fuzz.shrinking. The context signals are preserved_constraints.

Inspect the existing repository's shrinking convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in property-fuzz under their own verdicts.

Acceptance target: fixture:testing.property-fuzz.shrinking:repository-context. Given property-fuzz.shrinking has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent property fuzz concern; fail when the result infers local convention without an inspectable source.
