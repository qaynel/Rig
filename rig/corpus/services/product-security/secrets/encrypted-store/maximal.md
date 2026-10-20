# product-security.secrets.encrypted-store — maximal

Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: encrypted-store-source-code-boundary, encrypted-store-secrets-context, encrypted-store-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:product-security.secrets.encrypted-store:maximal:encrypted-store-source-code-boundary+encrypted-store-secrets-context+encrypted-store-evidence-receipt.

Declared predicates: encrypted-store-source-code-boundary: `secret_store` is nonempty (a string or array); encrypted-store-secrets-context: `encryption_at_rest` is nonempty (a string or array); encrypted-store-evidence-receipt: `store_plaintext_credentials` equals false.
