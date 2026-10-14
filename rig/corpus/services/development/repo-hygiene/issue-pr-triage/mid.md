# development.repo-hygiene.issue-pr-triage — mid

Mid adds repository context for issue pr triage; it does not widen ownership beyond repo-hygiene.issue-pr-triage. The context signals are responsible_owners.

Start from the existing repository's issue pr triage convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in repo-hygiene under their own verdicts.

Acceptance target: fixture:development.repo-hygiene.issue-pr-triage:repository-context. Given repo-hygiene.issue-pr-triage has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent repo hygiene concern; fail when the result infers local convention without an inspectable source.
