# product-security.secrets.toy-relaxation — mid

Mid adds repository context for toy relaxation; it does not widen ownership beyond secrets.toy-relaxation. The context signals are expires_after_days.

Anchor the review on the existing repository's toy relaxation convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in secrets under their own verdicts.

Acceptance target: fixture:product-security.secrets.toy-relaxation:repository-context. Given secrets.toy-relaxation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent secrets concern; fail when the result infers local convention without an inspectable source.
