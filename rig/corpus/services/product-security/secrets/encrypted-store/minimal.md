# product-security.secrets.encrypted-store — minimal

Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Policy grade, minimal: Name the encrypted store that holds secrets. Secrets in an unnamed place are untracked, so declare the authority. Binding checks: encrypted-store-source-code-boundary.

Acceptance target: policy:product-security.secrets.encrypted-store:minimal:encrypted-store-source-code-boundary.
Declared predicates: encrypted-store-source-code-boundary: `secret_store` is nonempty (a string or array).
