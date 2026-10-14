# development.documentation.adrs — mid

Mid adds repository context for adrs; it does not widen ownership beyond documentation.adrs. The context signals are alternatives.

Read the existing repository's adrs convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in documentation under their own verdicts.

Acceptance target: fixture:development.documentation.adrs:repository-context. Given documentation.adrs has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent documentation concern; fail when the result infers local convention without an inspectable source.
