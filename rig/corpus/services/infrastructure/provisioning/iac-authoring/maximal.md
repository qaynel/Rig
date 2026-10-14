# infrastructure.provisioning.iac-authoring — maximal

Maximal adds a replayable evidence receipt for iac authoring. The evidence must preserve the resource_names, state_backend, apply_without_reviewed_plan inputs that determined the result.

Read a second run against unchanged iac authoring inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.provisioning.iac-authoring:evidence-replay. Given the provisioning.iac-authoring binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
