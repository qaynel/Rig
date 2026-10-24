# infrastructure.cicd.deployment-strategy — minimal

Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Policy grade, minimal: Name the deployment strategy, such as canary or blue-green. An unnamed strategy has no measurable rollout, so declare which one ships. Binding checks: deployment-strategy-source-code-boundary.

Acceptance target: policy:infrastructure.cicd.deployment-strategy:minimal:deployment-strategy-source-code-boundary.
Declared predicates: deployment-strategy-source-code-boundary: `strategy` is nonempty (a string or array).
