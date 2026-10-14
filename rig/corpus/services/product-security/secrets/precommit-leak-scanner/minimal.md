# product-security.secrets.precommit-leak-scanner — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for precommit leak scanner. It checks scanner_command (nonempty): scanner command must name the concrete repository contract.. Binding checks: precommit-leak-scanner-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe secrets.precommit-leak-scanner; bind it to the input named in `rig-services/product-security.secrets.precommit-leak-scanner.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside secrets.precommit-leak-scanner is a failure.

Acceptance target: fixture:product-security.secrets.precommit-leak-scanner:policy-boundary. Given source-code is present and secrets.precommit-leak-scanner is selected, pass only when the repository binding evaluates secrets.precommit-leak-scanner and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Owned scope: `secrets.precommit-leak-scanner`.

Offer: Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Input: `rig-services/product-security.secrets.precommit-leak-scanner.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Select an approved repository-owned command to verify that behavior.

minimal: scanner command — ["gitleaks","protect"].

mid: scan scope — "staged-diff".

maximal: ignore scanner exit — false.
