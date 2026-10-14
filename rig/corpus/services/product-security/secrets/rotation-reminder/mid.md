# product-security.secrets.rotation-reminder — mid

Mid adds repository context for rotation reminder; it does not widen ownership beyond secrets.rotation-reminder. The context signals are rotation_interval_days.

Use the existing repository's rotation reminder convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in secrets under their own verdicts.

Acceptance target: fixture:product-security.secrets.rotation-reminder:repository-context. Given secrets.rotation-reminder has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent secrets concern; fail when the result infers local convention without an inspectable source.
