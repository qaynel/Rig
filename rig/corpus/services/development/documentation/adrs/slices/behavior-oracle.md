# development.documentation.adrs — behavior-oracle slice

Policy grade slice. This slice bounds adrs to documentation.adrs. It uses `adrs-slice-behavior-oracle` and checks decision (nonempty): decision must name the concrete repository contract..

Start from a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.documentation.adrs.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than adrs configuration validation only; declared policy does not prove running adrs behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Owned scope: `documentation.adrs`.

Offer: Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Input: `rig-services/development.documentation.adrs.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: adrs configuration validation only; declared policy does not prove running adrs behavior. Select an approved repository-owned command to verify that behavior.

minimal: decision — "Use the existing journal for recovery".

mid: alternatives — ["overwrite files directly"].

maximal: consequences — ["recoverable preimages"].
