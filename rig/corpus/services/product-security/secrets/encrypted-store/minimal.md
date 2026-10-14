# product-security.secrets.encrypted-store — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for encrypted store. It checks secret_store (nonempty): secret store must name the concrete repository contract.. Binding checks: encrypted-store-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe secrets.encrypted-store; bind it to the input named in `rig-services/product-security.secrets.encrypted-store.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside secrets.encrypted-store is a failure.

Acceptance target: fixture:product-security.secrets.encrypted-store:policy-boundary. Given source-code is present and secrets.encrypted-store is selected, pass only when the repository binding evaluates secrets.encrypted-store and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Owned scope: `secrets.encrypted-store`.

Offer: Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Input: `rig-services/product-security.secrets.encrypted-store.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: encrypted store configuration validation only; declared policy does not prove running encrypted store behavior. Select an approved repository-owned command to verify that behavior.

minimal: secret store — "managed vault".

mid: encryption at rest — "provider-managed-kms".

maximal: store plaintext credentials — false.
