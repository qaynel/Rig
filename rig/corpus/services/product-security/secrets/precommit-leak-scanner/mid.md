# product-security.secrets.precommit-leak-scanner — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for precommit leak scanner; it does not widen ownership beyond secrets.precommit-leak-scanner. The context signals are scan_scope. Binding checks: precommit-leak-scanner-secrets-context.

Inspect the existing repository's precommit leak scanner convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in secrets under their own verdicts.

Acceptance target: fixture:product-security.secrets.precommit-leak-scanner:repository-context. Given secrets.precommit-leak-scanner has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent secrets concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Owned scope: `secrets.precommit-leak-scanner`.

Offer: Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Input: `rig-services/product-security.secrets.precommit-leak-scanner.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Select an approved repository-owned command to verify that behavior.

minimal: scanner command — ["gitleaks","protect"].

mid: scan scope — "staged-diff".

maximal: ignore scanner exit — false.
