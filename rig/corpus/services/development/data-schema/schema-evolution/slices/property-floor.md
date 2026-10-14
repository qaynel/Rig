# development.data-schema.schema-evolution — property-floor slice

Policy grade slice. This slice bounds schema evolution to data-schema.schema-evolution. It uses `schema-evolution-slice-property-floor` and checks compatible_readers (nonempty): compatible readers must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.data-schema.schema-evolution.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Owned scope: `data-schema.schema-evolution`.

Offer: Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Input: `rig-services/development.data-schema.schema-evolution.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Select an approved repository-owned command to verify that behavior.

minimal: compatible readers — ["v1","v2"].

mid: unknown field policy — "ignore-additive-fields".

maximal: remove required fields — false.
