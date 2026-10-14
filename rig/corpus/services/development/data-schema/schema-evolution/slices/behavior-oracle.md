# development.data-schema.schema-evolution — behavior-oracle slice

This slice bounds schema evolution to data-schema.schema-evolution. It uses `schema-evolution-slice-behavior-oracle` and checks compatible_readers (nonempty): compatible readers must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.data-schema.schema-evolution.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Select an approved repository-owned command to verify that behavior.
