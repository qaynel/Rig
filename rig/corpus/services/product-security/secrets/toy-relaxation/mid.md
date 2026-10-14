# product-security.secrets.toy-relaxation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for toy relaxation; it does not widen ownership beyond secrets.toy-relaxation. For toy relaxation, inspect these context signals: expires_after_days. Binding checks: toy-relaxation-secrets-context.

Anchor the review on the existing repository's toy relaxation convention, then name the source path or command that establishes it. For toy relaxation, inspect the repository's actual spec, source, test, or configuration for expires_after_days; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring secrets services outside the toy relaxation decision for secrets.toy-relaxation.

Acceptance target: fixture:product-security.secrets.toy-relaxation:repository-context. Given secrets.toy-relaxation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent secrets concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.
minimal: toy scope — ["local disposable fixture"].
mid: expires after days — 1.
maximal: permit production use — false.
