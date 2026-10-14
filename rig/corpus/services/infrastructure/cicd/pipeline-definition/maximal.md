# infrastructure.cicd.pipeline-definition — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for pipeline definition. The evidence must preserve the stages, required_checks, deploy_after_failed_checks inputs that determined the result. Binding checks: pipeline-definition-evidence-receipt.

Ground the decision in a second run against unchanged pipeline definition inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cicd.pipeline-definition:evidence-replay. Given the cicd.pipeline-definition binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Owned scope: `cicd.pipeline-definition`.

Offer: Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Input: `rig-services/infrastructure.cicd.pipeline-definition.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Select an approved repository-owned command to verify that behavior.

minimal: stages — ["build","test","deploy"].

mid: required checks — ["test"].

maximal: deploy after failed checks — false.
