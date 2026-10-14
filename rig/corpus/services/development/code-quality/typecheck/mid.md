# development.code-quality.typecheck — mid

Mid adds repository context for typecheck; it does not widen ownership beyond code-quality.typecheck. The context signals are checked_components.

Start from the existing repository's typecheck convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in code-quality under their own verdicts.

Acceptance target: fixture:development.code-quality.typecheck:repository-context. Given code-quality.typecheck has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code quality concern; fail when the result infers local convention without an inspectable source.
