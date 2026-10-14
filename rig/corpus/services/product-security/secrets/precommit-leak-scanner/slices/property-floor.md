# product-security.secrets.precommit-leak-scanner — property-floor slice

Policy grade slice. This slice bounds precommit leak scanner to secrets.precommit-leak-scanner. It uses `precommit-leak-scanner-slice-property-floor` and checks scanner_command (nonempty): scanner command must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.secrets.precommit-leak-scanner.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Owned scope: `secrets.precommit-leak-scanner`.

Offer: Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Input: `rig-services/product-security.secrets.precommit-leak-scanner.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Select an approved repository-owned command to verify that behavior.

minimal: scanner command — ["gitleaks","protect"].

mid: scan scope — "staged-diff".

maximal: ignore scanner exit — false.
