# infrastructure.cicd.pipeline-definition — maximal

Maximal adds a replayable evidence receipt for pipeline definition. The evidence must preserve the stages, required_checks, deploy_after_failed_checks inputs that determined the result.

Ground the decision in a second run against unchanged pipeline definition inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cicd.pipeline-definition:evidence-replay. Given the cicd.pipeline-definition binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
