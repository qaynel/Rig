# development.documentation.api-reference — behavior-oracle slice

This slice bounds api reference to documentation.api-reference. It uses `api-reference-slice-behavior-oracle` and checks documented_endpoints (nonempty): documented endpoints must name the concrete repository contract..

Start from a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.documentation.api-reference.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than api reference configuration validation only; declared policy does not prove running api reference behavior. Select an approved repository-owned command to verify that behavior.
