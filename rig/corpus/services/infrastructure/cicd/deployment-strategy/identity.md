# infrastructure.cicd.deployment-strategy — identity

Policy grade: deployment-strategy owns cicd.deployment-strategy. Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Input: `rig-services/infrastructure.cicd.deployment-strategy.json`. Configuration validation only, so it confirms the rollout strategy, rollback trigger and the no-unchecked-rollout flag are declared; it does not show a canary or rollback ever ran.

Disposition: executable.
Acceptance target: policy:infrastructure.cicd.deployment-strategy:minimal:deployment-strategy-source-code-boundary.
Declared predicates: deployment-strategy-source-code-boundary: `strategy` is nonempty (a string or array).
