# encrypted store

Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Owned scope: `secrets.encrypted-store`.

Offer: Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Input: `rig-services/product-security.secrets.encrypted-store.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: encrypted store configuration validation only; declared policy does not prove running encrypted store behavior. Select an approved repository-owned command to verify that behavior.

minimal: secret store — "managed vault".

mid: encryption at rest — "provider-managed-kms".

maximal: store plaintext credentials — false.
