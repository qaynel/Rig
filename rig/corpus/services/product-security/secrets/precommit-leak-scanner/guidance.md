# precommit leak scanner

Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Owned scope: `secrets.precommit-leak-scanner`.

Offer: Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Input: `rig-services/product-security.secrets.precommit-leak-scanner.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Select an approved repository-owned command to verify that behavior.

minimal: scanner command — ["gitleaks","protect"].

mid: scan scope — "staged-diff".

maximal: ignore scanner exit — false.
