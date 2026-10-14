# testing.property-fuzz.shrinking — floor and mutation-floor slice

This slice bounds shrinking to property-fuzz.shrinking. It uses `shrinking-slice-floor` and checks failure_predicate (nonempty): failure predicate must name the concrete repository contract..

Use a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.property-fuzz.shrinking.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than shrinking configuration validation only; declared policy does not prove running shrinking behavior. Select an approved repository-owned command to verify that behavior.
