# encrypted-store

Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Owned scope: `secrets.encrypted-store`. Input: `rig-services/product-security.secrets.encrypted-store.json`.

Coverage ceiling: Configuration validation only, so it confirms the secret store, encryption at rest and the plaintext flag are declared; it does not inspect the deployed vault.

minimal: secret store — "managed vault". Name the encrypted store that holds secrets. Secrets in an unnamed place are untracked, so declare the authority.

mid: encryption at rest — "provider-managed-kms". Declare the encryption-at-rest and key management in use. Without it encryption is a claim, so name the mechanism.

maximal: store plaintext credentials — false. Set storing plaintext credentials to false. A credential stored in the clear is a leak, so move it into the store.
