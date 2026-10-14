# development.repo-hygiene.issue-pr-triage — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for issue pr triage; it does not widen ownership beyond repo-hygiene.issue-pr-triage. For issue pr triage, inspect these context signals: responsible_owners. Binding checks: issue-pr-triage-repo-hygiene-context.

Start from the existing repository's issue pr triage convention, then name the source path or command that establishes it. For issue pr triage, inspect the repository's actual spec, source, test, or configuration for responsible_owners; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring repo-hygiene services outside the issue pr triage decision for repo-hygiene.issue-pr-triage.

Acceptance target: fixture:development.repo-hygiene.issue-pr-triage:repository-context. Given repo-hygiene.issue-pr-triage has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent repo hygiene concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.
minimal: triage labels — ["bug","needs-reproduction"].
mid: responsible owners — ["maintainers"].
maximal: close without disposition — false.
