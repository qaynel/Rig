# product-security.secrets.precommit-leak-scanner — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for precommit leak scanner. The evidence must preserve the scanner_command, scan_scope, ignore_scanner_exit inputs that determined the result. Binding checks: precommit-leak-scanner-evidence-receipt.

Tie acceptance to a second run against unchanged precommit leak scanner inputs. Record the scanner_command, scan_scope, ignore_scanner_exit inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this precommit leak scanner result is stale. The ceiling remains: precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Choose a repository-owned check that observes precommit leak scanner from rig-services/product-security.secrets.precommit-leak-scanner.json.

Acceptance target: fixture:product-security.secrets.precommit-leak-scanner:evidence-replay. Given the secrets.precommit-leak-scanner binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.
minimal: scanner command — ["gitleaks","protect"].
mid: scan scope — "staged-diff".
maximal: ignore scanner exit — false.
