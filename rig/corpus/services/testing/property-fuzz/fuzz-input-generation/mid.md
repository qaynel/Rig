# testing.property-fuzz.fuzz-input-generation — mid

Mid adds repository context for fuzz input generation; it does not widen ownership beyond property-fuzz.fuzz-input-generation. The context signals are reproduction_seed.

Ground the decision in the existing repository's fuzz input generation convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in property-fuzz under their own verdicts.

Acceptance target: fixture:testing.property-fuzz.fuzz-input-generation:repository-context. Given property-fuzz.fuzz-input-generation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent property fuzz concern; fail when the result infers local convention without an inspectable source.
