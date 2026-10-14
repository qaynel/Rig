# product-security.secrets.rotation-reminder — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for rotation reminder. The evidence must preserve the credential_classes, rotation_interval_days, rotation_without_owner inputs that determined the result. Binding checks: rotation-reminder-evidence-receipt.

Start from a second run against unchanged rotation reminder inputs. Record the credential_classes, rotation_interval_days, rotation_without_owner inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this rotation reminder result is stale. The ceiling remains: rotation reminder configuration validation only; declared policy does not prove running rotation reminder behavior. Choose a repository-owned check that observes rotation reminder from rig-services/product-security.secrets.rotation-reminder.json.

Acceptance target: fixture:product-security.secrets.rotation-reminder:evidence-replay. Given the secrets.rotation-reminder binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.
minimal: credential classes — ["service token"].
mid: rotation interval days — 90.
maximal: rotation without owner — false.
