# development.repo-hygiene.status-updates — mid

Mid adds repository context for status updates; it does not widen ownership beyond repo-hygiene.status-updates. The context signals are in_flight.

Trace the verdict to the existing repository's status updates convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in repo-hygiene under their own verdicts.

Acceptance target: fixture:development.repo-hygiene.status-updates:repository-context. Given repo-hygiene.status-updates has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent repo hygiene concern; fail when the result infers local convention without an inspectable source.
