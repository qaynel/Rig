# infrastructure.cicd.deployment-strategy — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for deployment strategy; it does not widen ownership beyond cicd.deployment-strategy. For deployment strategy, inspect these context signals: rollback_trigger. Binding checks: deployment-strategy-cicd-context.

Ground the decision in the existing repository's deployment strategy convention, then name the source path or command that establishes it. For deployment strategy, inspect the repository's actual spec, source, test, or configuration for rollback_trigger; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring cicd services outside the deployment strategy decision for cicd.deployment-strategy.

Acceptance target: fixture:infrastructure.cicd.deployment-strategy:repository-context. Given cicd.deployment-strategy has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cicd concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.
minimal: strategy — "canary".
mid: rollback trigger — "error rate above budget".
maximal: automatic full rollout without checks — false.
