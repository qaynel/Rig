# testing.integration.cross-module — mid

Mid adds repository context for cross module; it does not widen ownership beyond integration.cross-module. The context signals are interaction_cases.

Ground the decision in the existing repository's cross module convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in integration under their own verdicts.

Acceptance target: fixture:testing.integration.cross-module:repository-context. Given integration.cross-module has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent integration concern; fail when the result infers local convention without an inspectable source.
