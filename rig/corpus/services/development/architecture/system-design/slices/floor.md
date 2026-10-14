# development.architecture.system-design — floor and mutation-floor slice

This slice bounds system design to architecture.system-design. It uses `system-design-slice-floor` and checks components (nonempty): components must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.architecture.system-design.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than system design configuration validation only; declared policy does not prove running system design behavior. Select an approved repository-owned command to verify that behavior.
