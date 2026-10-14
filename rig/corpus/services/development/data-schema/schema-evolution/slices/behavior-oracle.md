# development.data-schema.schema-evolution — behavior-oracle slice

Policy grade slice. This slice bounds schema evolution to data-schema.schema-evolution. It uses `schema-evolution-slice-behavior-oracle` and checks compatible_readers (nonempty): compatible readers must name the concrete repository contract..

For schema evolution, choose a repository example that satisfies compatible_readers at the behavior-oracle floor, plus a failure where compatible readers must name the concrete repository contract. is false. For schema evolution, wire `behavior-oracle` to `rig-services/development.data-schema.schema-evolution.json` and keep its verdict on compatible_readers; missing evidence is a named gap, with ceiling schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Choose a repository-owned check that observes schema evolution from rig-services/development.data-schema.schema-evolution.json..

Service-specific evidence cues:
Offer: Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.
minimal: compatible readers — ["v1","v2"].
mid: unknown field policy — "ignore-additive-fields".
maximal: remove required fields — false.
