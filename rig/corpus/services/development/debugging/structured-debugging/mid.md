# development.debugging.structured-debugging — mid

Mid adds repository context for structured debugging; it does not widen ownership beyond debugging.structured-debugging. The context signals are ranked_hypotheses.

Inspect the existing repository's structured debugging convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in debugging under their own verdicts.

Acceptance target: fixture:development.debugging.structured-debugging:repository-context. Given debugging.structured-debugging has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent debugging concern; fail when the result infers local convention without an inspectable source.
