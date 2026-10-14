# infrastructure.cicd.pipeline-definition — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for pipeline definition. The evidence must preserve the stages, required_checks, deploy_after_failed_checks inputs that determined the result. Binding checks: pipeline-definition-evidence-receipt.

Ground the decision in a second run against unchanged pipeline definition inputs. Record the stages, required_checks, deploy_after_failed_checks inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this pipeline definition result is stale. The ceiling remains: pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Choose a repository-owned check that observes pipeline definition from rig-services/infrastructure.cicd.pipeline-definition.json.

Acceptance target: fixture:infrastructure.cicd.pipeline-definition:evidence-replay. Given the cicd.pipeline-definition binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.
minimal: stages — ["build","test","deploy"].
mid: required checks — ["test"].
maximal: deploy after failed checks — false.
