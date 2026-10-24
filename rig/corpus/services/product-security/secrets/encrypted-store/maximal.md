# product-security.secrets.encrypted-store — maximal

Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Policy grade, maximal: Set storing plaintext credentials to false. A credential stored in the clear is a leak, so move it into the store. Cumulative with minimal and mid. Binding checks: encrypted-store-source-code-boundary, encrypted-store-secrets-context, encrypted-store-evidence-receipt.

Acceptance target: policy:product-security.secrets.encrypted-store:maximal:encrypted-store-source-code-boundary+encrypted-store-secrets-context+encrypted-store-evidence-receipt.
Declared predicates: encrypted-store-source-code-boundary: `secret_store` is nonempty (a string or array); encrypted-store-secrets-context: `encryption_at_rest` is nonempty (a string or array); encrypted-store-evidence-receipt: `store_plaintext_credentials` equals false.
