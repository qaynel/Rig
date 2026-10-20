# infrastructure.cicd.deployment-strategy — maximal

Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: deployment-strategy-source-code-boundary, deployment-strategy-cicd-context, deployment-strategy-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:infrastructure.cicd.deployment-strategy:maximal:deployment-strategy-source-code-boundary+deployment-strategy-cicd-context+deployment-strategy-evidence-receipt.

Declared predicates: deployment-strategy-source-code-boundary: `strategy` is nonempty (a string or array); deployment-strategy-cicd-context: `rollback_trigger` is nonempty (a string or array); deployment-strategy-evidence-receipt: `automatic_full_rollout_without_checks` equals false.
