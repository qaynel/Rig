# testing.test-data.anonymization — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for anonymization. The evidence must preserve the sensitive_fields, replacement_strategy, retain_reidentification_map inputs that determined the result. Binding checks: anonymization-evidence-receipt.

Use a second run against unchanged anonymization inputs. Record the sensitive_fields, replacement_strategy, retain_reidentification_map inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this anonymization result is stale. The ceiling remains: anonymization configuration validation only; declared policy does not prove running anonymization behavior. Choose a repository-owned check that observes anonymization from rig-services/testing.test-data.anonymization.json.

Acceptance target: fixture:testing.test-data.anonymization:evidence-replay. Given the test-data.anonymization binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.
minimal: sensitive fields — ["email","address"].
mid: replacement strategy — "irreversible-synthetic-values".
maximal: retain reidentification map — false.
