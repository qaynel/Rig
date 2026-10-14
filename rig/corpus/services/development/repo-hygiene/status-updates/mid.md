# development.repo-hygiene.status-updates — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for status updates; it does not widen ownership beyond repo-hygiene.status-updates. For status updates, inspect these context signals: in_flight. Binding checks: status-updates-repo-hygiene-context.

Trace the verdict to the existing repository's status updates convention, then name the source path or command that establishes it. For status updates, inspect the repository's actual spec, source, test, or configuration for in_flight; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring repo-hygiene services outside the status updates decision for repo-hygiene.status-updates.

Acceptance target: fixture:development.repo-hygiene.status-updates:repository-context. Given repo-hygiene.status-updates has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent repo hygiene concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.
minimal: completed — ["parser regression reproduced"].
mid: in flight — ["shared boundary fix"].
maximal: next action — "run parser regression".
