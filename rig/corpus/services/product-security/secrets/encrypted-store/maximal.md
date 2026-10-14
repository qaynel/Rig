# product-security.secrets.encrypted-store — maximal

Maximal adds a replayable evidence receipt for encrypted store. The evidence must preserve the secret_store, encryption_at_rest, store_plaintext_credentials inputs that determined the result.

Inspect a second run against unchanged encrypted store inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: encrypted store configuration validation only; declared policy does not prove running encrypted store behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.secrets.encrypted-store:evidence-replay. Given the secrets.encrypted-store binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
