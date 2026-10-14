# product-security.secrets.encrypted-store — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for encrypted store; it does not widen ownership beyond secrets.encrypted-store. For encrypted store, inspect these context signals: encryption_at_rest. Binding checks: encrypted-store-secrets-context.

Anchor the review on the existing repository's encrypted store convention, then name the source path or command that establishes it. For encrypted store, inspect the repository's actual spec, source, test, or configuration for encryption_at_rest; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring secrets services outside the encrypted store decision for secrets.encrypted-store.

Acceptance target: fixture:product-security.secrets.encrypted-store:repository-context. Given secrets.encrypted-store has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent secrets concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.
minimal: secret store — "managed vault".
mid: encryption at rest — "provider-managed-kms".
maximal: store plaintext credentials — false.
