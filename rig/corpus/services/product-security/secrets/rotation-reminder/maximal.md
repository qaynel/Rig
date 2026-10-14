# product-security.secrets.rotation-reminder — maximal

Maximal adds a replayable evidence receipt for rotation reminder. The evidence must preserve the credential_classes, rotation_interval_days, rotation_without_owner inputs that determined the result.

Start from a second run against unchanged rotation reminder inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: rotation reminder configuration validation only; declared policy does not prove running rotation reminder behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.secrets.rotation-reminder:evidence-replay. Given the secrets.rotation-reminder binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
