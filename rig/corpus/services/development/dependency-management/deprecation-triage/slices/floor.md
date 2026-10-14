# development.dependency-management.deprecation-triage — floor and mutation-floor slice

This slice bounds deprecation triage to dependency-management.deprecation-triage. It uses `deprecation-triage-slice-floor` and checks deprecated_apis (nonempty): deprecated apis must name the concrete repository contract..

Read a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.dependency-management.deprecation-triage.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Select an approved repository-owned command to verify that behavior.
