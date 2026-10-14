# development.repo-hygiene.issue-pr-triage — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for issue pr triage; it does not widen ownership beyond repo-hygiene.issue-pr-triage. The context signals are responsible_owners. Binding checks: issue-pr-triage-repo-hygiene-context.

Start from the existing repository's issue pr triage convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in repo-hygiene under their own verdicts.

Acceptance target: fixture:development.repo-hygiene.issue-pr-triage:repository-context. Given repo-hygiene.issue-pr-triage has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent repo hygiene concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Owned scope: `repo-hygiene.issue-pr-triage`.

Offer: Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Input: `rig-services/development.repo-hygiene.issue-pr-triage.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: issue pr triage configuration validation only; declared policy does not prove running issue pr triage behavior. Select an approved repository-owned command to verify that behavior.

minimal: triage labels — ["bug","needs-reproduction"].

mid: responsible owners — ["maintainers"].

maximal: close without disposition — false.
