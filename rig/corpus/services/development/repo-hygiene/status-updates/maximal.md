# development.repo-hygiene.status-updates — maximal

Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: status-updates-source-code-boundary, status-updates-repo-hygiene-context, status-updates-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:development.repo-hygiene.status-updates:maximal:status-updates-source-code-boundary+status-updates-repo-hygiene-context+status-updates-evidence-receipt.

Declared predicates: status-updates-source-code-boundary: `completed` is nonempty (a string or array); status-updates-repo-hygiene-context: `in_flight` is nonempty (a string or array); status-updates-evidence-receipt: `next_action` is nonempty (a string or array).
