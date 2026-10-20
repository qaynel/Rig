# development.repo-hygiene.status-updates — mid

Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: status-updates-source-code-boundary, status-updates-repo-hygiene-context.

Trace the verdict to the existing repository's status updates convention, then name the source path or command that establishes it. For status updates, inspect the repository's actual spec, source, test, or configuration for in_flight; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring repo-hygiene services outside the status updates decision for repo-hygiene.status-updates.

Acceptance target: policy:development.repo-hygiene.status-updates:mid:status-updates-source-code-boundary+status-updates-repo-hygiene-context.

Declared predicates: status-updates-source-code-boundary: `completed` is nonempty (a string or array); status-updates-repo-hygiene-context: `in_flight` is nonempty (a string or array).
