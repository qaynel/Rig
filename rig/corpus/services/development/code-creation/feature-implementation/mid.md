# development.code-creation.feature-implementation — mid

Mid adds repository context for feature implementation; it does not widen ownership beyond code-creation.feature-implementation. The context signals are change_scope.

Trace the verdict to the existing repository's feature implementation convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in code-creation under their own verdicts.

Acceptance target: fixture:development.code-creation.feature-implementation:repository-context. Given code-creation.feature-implementation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code creation concern; fail when the result infers local convention without an inspectable source.
