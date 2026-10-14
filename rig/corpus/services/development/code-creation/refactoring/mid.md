# development.code-creation.refactoring — mid

Mid adds repository context for refactoring; it does not widen ownership beyond code-creation.refactoring. The context signals are public_api_changes.

Use the existing repository's refactoring convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in code-creation under their own verdicts.

Acceptance target: fixture:development.code-creation.refactoring:repository-context. Given code-creation.refactoring has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code creation concern; fail when the result infers local convention without an inspectable source.
