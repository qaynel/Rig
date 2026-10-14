# testing.integration.cross-module — behavior-oracle slice

This slice bounds cross module to integration.cross-module. It uses `cross-module-slice-behavior-oracle` and checks participating_modules (nonempty): participating modules must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.integration.cross-module.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than cross module configuration validation only; declared policy does not prove running cross module behavior. Select an approved repository-owned command to verify that behavior.
