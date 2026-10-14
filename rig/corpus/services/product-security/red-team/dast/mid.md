# product-security.red-team.dast — mid

Mid adds repository context for dast; it does not widen ownership beyond red-team.dast. The context signals are authorized_scope.

Read the existing repository's dast convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in red-team under their own verdicts.

Acceptance target: fixture:product-security.red-team.dast:repository-context. Given red-team.dast has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent red team concern; fail when the result infers local convention without an inspectable source.
