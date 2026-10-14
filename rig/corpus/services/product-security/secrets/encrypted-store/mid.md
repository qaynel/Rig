# product-security.secrets.encrypted-store — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for encrypted store; it does not widen ownership beyond secrets.encrypted-store. The context signals are encryption_at_rest. Binding checks: encrypted-store-secrets-context.

Anchor the review on the existing repository's encrypted store convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in secrets under their own verdicts.

Acceptance target: fixture:product-security.secrets.encrypted-store:repository-context. Given secrets.encrypted-store has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent secrets concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Owned scope: `secrets.encrypted-store`.

Offer: Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Input: `rig-services/product-security.secrets.encrypted-store.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: encrypted store configuration validation only; declared policy does not prove running encrypted store behavior. Select an approved repository-owned command to verify that behavior.

minimal: secret store — "managed vault".

mid: encryption at rest — "provider-managed-kms".

maximal: store plaintext credentials — false.
