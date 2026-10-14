# testing.maintenance.readability-dry — mid

Mid adds repository context for readability dry; it does not widen ownership beyond maintenance.readability-dry. The context signals are shared_helpers.

Anchor the review on the existing repository's readability dry convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in maintenance under their own verdicts.

Acceptance target: fixture:testing.maintenance.readability-dry:repository-context. Given maintenance.readability-dry has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent maintenance concern; fail when the result infers local convention without an inspectable source.
