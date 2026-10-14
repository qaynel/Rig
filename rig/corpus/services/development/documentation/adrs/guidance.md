# adrs

Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Owned scope: `documentation.adrs`.

Offer: Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Input: `rig-services/development.documentation.adrs.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: adrs configuration validation only; declared policy does not prove running adrs behavior. Select an approved repository-owned command to verify that behavior.

minimal: decision — "Use the existing journal for recovery".

mid: alternatives — ["overwrite files directly"].

maximal: consequences — ["recoverable preimages"].

