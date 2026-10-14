# testing.maintenance.test-code-sync — mid

Mid adds repository context for test code sync; it does not widen ownership beyond maintenance.test-code-sync. The context signals are updated_cases.

Anchor the review on the existing repository's test code sync convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in maintenance under their own verdicts.

Acceptance target: fixture:testing.maintenance.test-code-sync:repository-context. Given maintenance.test-code-sync has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent maintenance concern; fail when the result infers local convention without an inspectable source.
