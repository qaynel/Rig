# infrastructure.cicd.deployment-strategy — mid

Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Policy grade, mid: State the measurable condition that triggers rollback, such as an error-rate threshold. Without a trigger a bad release keeps rolling, so write the number. Cumulative with minimal. Binding checks: deployment-strategy-source-code-boundary, deployment-strategy-cicd-context.

Acceptance target: policy:infrastructure.cicd.deployment-strategy:mid:deployment-strategy-source-code-boundary+deployment-strategy-cicd-context.
Declared predicates: deployment-strategy-source-code-boundary: `strategy` is nonempty (a string or array); deployment-strategy-cicd-context: `rollback_trigger` is nonempty (a string or array).
