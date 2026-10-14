# infrastructure.provisioning.environment-parity — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for environment parity. The evidence must preserve the environments, intentional_differences, unrecorded_differences_allowed inputs that determined the result. Binding checks: environment-parity-evidence-receipt.

Inspect a second run against unchanged environment parity inputs. Record the environments, intentional_differences, unrecorded_differences_allowed inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this environment parity result is stale. The ceiling remains: environment parity configuration validation only; declared policy does not prove running environment parity behavior. Choose a repository-owned check that observes environment parity from rig-services/infrastructure.provisioning.environment-parity.json.

Acceptance target: fixture:infrastructure.provisioning.environment-parity:evidence-replay. Given the provisioning.environment-parity binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.
minimal: environments — ["staging","production"].
mid: intentional differences — ["instance count"].
maximal: unrecorded differences allowed — false.
