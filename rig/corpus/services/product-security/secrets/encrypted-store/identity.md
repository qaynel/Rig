# product-security.secrets.encrypted-store — identity

Policy grade: encrypted store owns secrets.encrypted-store. Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Keep neighboring secrets services outside the encrypted store decision for secrets.encrypted-store. Use the configured input at `rig-services/product-security.secrets.encrypted-store.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: encrypted store configuration validation only; declared policy does not prove running encrypted store behavior. Choose a repository-owned check that observes encrypted store from rig-services/product-security.secrets.encrypted-store.json.

Acceptance target: fixture:product-security.secrets.encrypted-store:policy-boundary. Given source-code is present and secrets.encrypted-store is selected, pass only when the repository binding evaluates secrets.encrypted-store and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern.

Service-specific evidence cues:
Offer: Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.
minimal: secret store — "managed vault".
mid: encryption at rest — "provider-managed-kms".
maximal: store plaintext credentials — false.
