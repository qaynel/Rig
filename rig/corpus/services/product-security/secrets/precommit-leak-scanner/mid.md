# product-security.secrets.precommit-leak-scanner — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for precommit leak scanner; it does not widen ownership beyond secrets.precommit-leak-scanner. For precommit leak scanner, inspect these context signals: scan_scope. Binding checks: precommit-leak-scanner-secrets-context.

Inspect the existing repository's precommit leak scanner convention, then name the source path or command that establishes it. For precommit leak scanner, inspect the repository's actual spec, source, test, or configuration for scan_scope; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring secrets services outside the precommit leak scanner decision for secrets.precommit-leak-scanner.

Acceptance target: fixture:product-security.secrets.precommit-leak-scanner:repository-context. Given secrets.precommit-leak-scanner has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent secrets concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.
minimal: scanner command — ["gitleaks","protect"].
mid: scan scope — "staged-diff".
maximal: ignore scanner exit — false.
