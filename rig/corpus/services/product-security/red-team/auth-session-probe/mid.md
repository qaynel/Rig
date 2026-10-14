# product-security.red-team.auth-session-probe — mid

Mid adds repository context for auth session probe; it does not widen ownership beyond red-team.auth-session-probe. The context signals are protected_routes.

Read the existing repository's auth session probe convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in red-team under their own verdicts.

Acceptance target: fixture:product-security.red-team.auth-session-probe:repository-context. Given red-team.auth-session-probe has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent red team concern; fail when the result infers local convention without an inspectable source.
