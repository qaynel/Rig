# product-security.secrets.encrypted-store — identity

Policy grade: encrypted store owns secrets.encrypted-store. Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Keep neighboring secrets services outside the encrypted store decision for secrets.encrypted-store. Use the configured input at `rig-services/product-security.secrets.encrypted-store.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: encrypted store configuration validation only; declared policy does not prove running encrypted store behavior. Choose a repository-owned check that observes encrypted store from rig-services/product-security.secrets.encrypted-store.json.

Acceptance target: policy:product-security.secrets.encrypted-store:minimal:encrypted-store-source-code-boundary.

Declared predicates: encrypted-store-source-code-boundary: `secret_store` is nonempty (a string or array).
