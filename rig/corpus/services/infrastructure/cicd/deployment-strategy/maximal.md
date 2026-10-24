# infrastructure.cicd.deployment-strategy — maximal

Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Policy grade, maximal: Set automatic full rollout without checks to false. Skipping the staged checks defeats the strategy, so gate the final step on them. Cumulative with minimal and mid. Binding checks: deployment-strategy-source-code-boundary, deployment-strategy-cicd-context, deployment-strategy-evidence-receipt.

Acceptance target: policy:infrastructure.cicd.deployment-strategy:maximal:deployment-strategy-source-code-boundary+deployment-strategy-cicd-context+deployment-strategy-evidence-receipt.
Declared predicates: deployment-strategy-source-code-boundary: `strategy` is nonempty (a string or array); deployment-strategy-cicd-context: `rollback_trigger` is nonempty (a string or array); deployment-strategy-evidence-receipt: `automatic_full_rollout_without_checks` equals false.
