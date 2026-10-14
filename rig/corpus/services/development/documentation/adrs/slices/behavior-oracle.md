# development.documentation.adrs — behavior-oracle slice

Policy grade slice. This slice bounds adrs to documentation.adrs. It uses `adrs-slice-behavior-oracle` and checks decision (nonempty): decision must name the concrete repository contract..

For adrs, choose a repository example that satisfies decision at the behavior-oracle floor, plus a failure where decision must name the concrete repository contract. is false. For adrs, wire `behavior-oracle` to `rig-services/development.documentation.adrs.json` and keep its verdict on decision; missing evidence is a named gap, with ceiling adrs configuration validation only; declared policy does not prove running adrs behavior. Choose a repository-owned check that observes adrs from rig-services/development.documentation.adrs.json..

Service-specific evidence cues:
Offer: Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.
minimal: decision — "Use the existing journal for recovery".
mid: alternatives — ["overwrite files directly"].
maximal: consequences — ["recoverable preimages"].
