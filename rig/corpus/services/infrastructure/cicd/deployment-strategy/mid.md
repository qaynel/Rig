# infrastructure.cicd.deployment-strategy — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for deployment strategy; it does not widen ownership beyond cicd.deployment-strategy. The context signals are rollback_trigger. Binding checks: deployment-strategy-cicd-context.

Ground the decision in the existing repository's deployment strategy convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in cicd under their own verdicts.

Acceptance target: fixture:infrastructure.cicd.deployment-strategy:repository-context. Given cicd.deployment-strategy has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cicd concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Owned scope: `cicd.deployment-strategy`.

Offer: Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Input: `rig-services/infrastructure.cicd.deployment-strategy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Select an approved repository-owned command to verify that behavior.

minimal: strategy — "canary".

mid: rollback trigger — "error rate above budget".

maximal: automatic full rollout without checks — false.
