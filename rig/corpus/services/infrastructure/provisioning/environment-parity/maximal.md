# infrastructure.provisioning.environment-parity — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for environment parity. The evidence must preserve the environments, intentional_differences, unrecorded_differences_allowed inputs that determined the result. Binding checks: environment-parity-evidence-receipt.

Inspect a second run against unchanged environment parity inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: environment parity configuration validation only; declared policy does not prove running environment parity behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.provisioning.environment-parity:evidence-replay. Given the provisioning.environment-parity binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Owned scope: `provisioning.environment-parity`.

Offer: Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Input: `rig-services/infrastructure.provisioning.environment-parity.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: environment parity configuration validation only; declared policy does not prove running environment parity behavior. Select an approved repository-owned command to verify that behavior.

minimal: environments — ["staging","production"].

mid: intentional differences — ["instance count"].

maximal: unrecorded differences allowed — false.
