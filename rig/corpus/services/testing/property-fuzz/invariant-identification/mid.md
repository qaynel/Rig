# testing.property-fuzz.invariant-identification — mid

Mid adds repository context for invariant identification; it does not widen ownership beyond property-fuzz.invariant-identification. The context signals are input_domain.

Start from the existing repository's invariant identification convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in property-fuzz under their own verdicts.

Acceptance target: fixture:testing.property-fuzz.invariant-identification:repository-context. Given property-fuzz.invariant-identification has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent property fuzz concern; fail when the result infers local convention without an inspectable source.
