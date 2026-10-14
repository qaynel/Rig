# infrastructure.provisioning.iac-authoring — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for iac authoring. The evidence must preserve the resource_names, state_backend, apply_without_reviewed_plan inputs that determined the result. Binding checks: iac-authoring-evidence-receipt.

Read a second run against unchanged iac authoring inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.provisioning.iac-authoring:evidence-replay. Given the provisioning.iac-authoring binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Owned scope: `provisioning.iac-authoring`.

Offer: Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Input: `rig-services/infrastructure.provisioning.iac-authoring.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Select an approved repository-owned command to verify that behavior.

minimal: resource names — ["app-network"].

mid: state backend — "encrypted-remote".

maximal: apply without reviewed plan — false.
