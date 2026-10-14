# testing.test-data.anonymization — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for anonymization. The evidence must preserve the sensitive_fields, replacement_strategy, retain_reidentification_map inputs that determined the result. Binding checks: anonymization-evidence-receipt.

Use a second run against unchanged anonymization inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: anonymization configuration validation only; declared policy does not prove running anonymization behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.test-data.anonymization:evidence-replay. Given the test-data.anonymization binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Owned scope: `test-data.anonymization`.

Offer: Identify every sensitive field and replace it irreversibly while preserving useful data shape. A retained lookup from synthetic values to people defeats anonymization.

Input: `rig-services/testing.test-data.anonymization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: anonymization configuration validation only; declared policy does not prove running anonymization behavior. Select an approved repository-owned command to verify that behavior.

minimal: sensitive fields — ["email","address"].

mid: replacement strategy — "irreversible-synthetic-values".

maximal: retain reidentification map — false.
