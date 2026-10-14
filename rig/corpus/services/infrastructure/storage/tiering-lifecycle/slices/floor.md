# infrastructure.storage.tiering-lifecycle — floor and mutation-floor slice

This slice bounds tiering lifecycle to storage.tiering-lifecycle. It uses `tiering-lifecycle-slice-floor` and checks storage_classes (nonempty): storage classes must name the concrete repository contract..

Start from a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.storage.tiering-lifecycle.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than tiering lifecycle configuration validation only; declared policy does not prove running tiering lifecycle behavior. Select an approved repository-owned command to verify that behavior.
