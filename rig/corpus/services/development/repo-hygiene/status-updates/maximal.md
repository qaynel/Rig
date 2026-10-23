# development.repo-hygiene.status-updates — maximal

Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Policy grade, maximal: State the next resolving action. A status without a next step leaves the work stalled, so write the single action that moves it forward. Cumulative with minimal and mid. Binding checks: status-updates-source-code-boundary, status-updates-repo-hygiene-context, status-updates-evidence-receipt.

Acceptance target: policy:development.repo-hygiene.status-updates:maximal:status-updates-source-code-boundary+status-updates-repo-hygiene-context+status-updates-evidence-receipt.
Declared predicates: status-updates-source-code-boundary: `completed` is nonempty (a string or array); status-updates-repo-hygiene-context: `in_flight` is nonempty (a string or array); status-updates-evidence-receipt: `next_action` is nonempty (a string or array).
