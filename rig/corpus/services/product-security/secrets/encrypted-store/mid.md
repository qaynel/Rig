# product-security.secrets.encrypted-store — mid

Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: encrypted-store-source-code-boundary, encrypted-store-secrets-context.

Acceptance target: policy:product-security.secrets.encrypted-store:mid:encrypted-store-source-code-boundary+encrypted-store-secrets-context.

Declared predicates: encrypted-store-source-code-boundary: `secret_store` is nonempty (a string or array); encrypted-store-secrets-context: `encryption_at_rest` is nonempty (a string or array).
