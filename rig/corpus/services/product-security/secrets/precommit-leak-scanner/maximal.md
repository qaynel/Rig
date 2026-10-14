# product-security.secrets.precommit-leak-scanner — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for precommit leak scanner. The evidence must preserve the scanner_command, scan_scope, ignore_scanner_exit inputs that determined the result. Binding checks: precommit-leak-scanner-evidence-receipt.

Tie acceptance to a second run against unchanged precommit leak scanner inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.secrets.precommit-leak-scanner:evidence-replay. Given the secrets.precommit-leak-scanner binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Owned scope: `secrets.precommit-leak-scanner`.

Offer: Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Input: `rig-services/product-security.secrets.precommit-leak-scanner.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Select an approved repository-owned command to verify that behavior.

minimal: scanner command — ["gitleaks","protect"].

mid: scan scope — "staged-diff".

maximal: ignore scanner exit — false.
