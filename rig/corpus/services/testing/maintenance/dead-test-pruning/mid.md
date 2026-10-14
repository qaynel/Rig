# testing.maintenance.dead-test-pruning — mid

Mid adds repository context for dead test pruning; it does not widen ownership beyond maintenance.dead-test-pruning. The context signals are replacement_evidence.

Inspect the existing repository's dead test pruning convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in maintenance under their own verdicts.

Acceptance target: fixture:testing.maintenance.dead-test-pruning:repository-context. Given maintenance.dead-test-pruning has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent maintenance concern; fail when the result infers local convention without an inspectable source.
