# product-security.secrets.precommit-leak-scanner — identity

Policy grade: precommit leak scanner owns secrets.precommit-leak-scanner. Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Keep neighboring secrets services outside the precommit leak scanner decision for secrets.precommit-leak-scanner. Start from the configured input at `rig-services/product-security.secrets.precommit-leak-scanner.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Choose a repository-owned check that observes precommit leak scanner from rig-services/product-security.secrets.precommit-leak-scanner.json.

Acceptance target: fixture:product-security.secrets.precommit-leak-scanner:policy-boundary. Given source-code is present and secrets.precommit-leak-scanner is selected, pass only when the repository binding evaluates secrets.precommit-leak-scanner and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern.

Service-specific evidence cues:
Offer: Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.
minimal: scanner command — ["gitleaks","protect"].
mid: scan scope — "staged-diff".
maximal: ignore scanner exit — false.
