# product-security.secrets.precommit-leak-scanner — mid

Mid adds repository context for precommit leak scanner; it does not widen ownership beyond secrets.precommit-leak-scanner. The context signals are scan_scope.

Inspect the existing repository's precommit leak scanner convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in secrets under their own verdicts.

Acceptance target: fixture:product-security.secrets.precommit-leak-scanner:repository-context. Given secrets.precommit-leak-scanner has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent secrets concern; fail when the result infers local convention without an inspectable source.
