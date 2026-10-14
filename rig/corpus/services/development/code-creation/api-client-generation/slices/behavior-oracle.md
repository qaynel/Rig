# development.code-creation.api-client-generation — behavior-oracle slice

This slice bounds api client generation to code-creation.api-client-generation. It uses `api-client-generation-slice-behavior-oracle` and checks specification_path (nonempty): specification path must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-creation.api-client-generation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than api client generation configuration validation only; declared policy does not prove running api client generation behavior. Select an approved repository-owned command to verify that behavior.
