# product-security.secrets.encrypted-store — identity

Policy grade: encrypted-store owns secrets.encrypted-store. Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Input: `rig-services/product-security.secrets.encrypted-store.json`. Configuration validation only, so it confirms the secret store, encryption at rest and the plaintext flag are declared; it does not inspect the deployed vault.

Disposition: executable.
Acceptance target: policy:product-security.secrets.encrypted-store:minimal:encrypted-store-source-code-boundary.
Declared predicates: encrypted-store-source-code-boundary: `secret_store` is nonempty (a string or array).
