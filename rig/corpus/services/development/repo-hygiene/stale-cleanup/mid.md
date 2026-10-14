# development.repo-hygiene.stale-cleanup — mid

Mid adds repository context for stale cleanup; it does not widen ownership beyond repo-hygiene.stale-cleanup. The context signals are reference_checks.

Use the existing repository's stale cleanup convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in repo-hygiene under their own verdicts.

Acceptance target: fixture:development.repo-hygiene.stale-cleanup:repository-context. Given repo-hygiene.stale-cleanup has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent repo hygiene concern; fail when the result infers local convention without an inspectable source.
