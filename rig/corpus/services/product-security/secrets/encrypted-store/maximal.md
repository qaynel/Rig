# product-security.secrets.encrypted-store — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for encrypted store. The evidence must preserve the secret_store, encryption_at_rest, store_plaintext_credentials inputs that determined the result. Binding checks: encrypted-store-evidence-receipt.

Inspect a second run against unchanged encrypted store inputs. Record the secret_store, encryption_at_rest, store_plaintext_credentials inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this encrypted store result is stale. The ceiling remains: encrypted store configuration validation only; declared policy does not prove running encrypted store behavior. Choose a repository-owned check that observes encrypted store from rig-services/product-security.secrets.encrypted-store.json.

Acceptance target: fixture:product-security.secrets.encrypted-store:evidence-replay. Given the secrets.encrypted-store binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.
minimal: secret store — "managed vault".
mid: encryption at rest — "provider-managed-kms".
maximal: store plaintext credentials — false.
