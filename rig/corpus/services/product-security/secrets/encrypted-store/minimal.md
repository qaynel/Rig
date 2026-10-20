# product-security.secrets.encrypted-store — minimal

Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for encrypted store. The minimal boundary for encrypted store checks secret_store (nonempty): secret store must name the concrete repository contract. Binding checks: encrypted-store-source-code-boundary.

Acceptance target: policy:product-security.secrets.encrypted-store:minimal:encrypted-store-source-code-boundary.

Declared predicates: encrypted-store-source-code-boundary: `secret_store` is nonempty (a string or array).
