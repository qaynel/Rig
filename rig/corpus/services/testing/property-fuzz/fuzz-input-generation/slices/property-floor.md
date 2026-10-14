# testing.property-fuzz.fuzz-input-generation — property-floor slice

This slice bounds fuzz input generation to property-fuzz.fuzz-input-generation. It uses `fuzz-input-generation-slice-property-floor` and checks input_seeds (nonempty): input seeds must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.property-fuzz.fuzz-input-generation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than fuzz input generation configuration validation only; declared policy does not prove running fuzz input generation behavior. Select an approved repository-owned command to verify that behavior.
