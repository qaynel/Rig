# infrastructure.storage.tiering-lifecycle — property-floor slice

Policy grade slice. This slice bounds tiering lifecycle to storage.tiering-lifecycle. It uses `tiering-lifecycle-slice-property-floor` and checks storage_classes (nonempty): storage classes must name the concrete repository contract..

Use a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.storage.tiering-lifecycle.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than tiering lifecycle configuration validation only; declared policy does not prove running tiering lifecycle behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Owned scope: `storage.tiering-lifecycle`.

Offer: Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Input: `rig-services/infrastructure.storage.tiering-lifecycle.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: tiering lifecycle configuration validation only; declared policy does not prove running tiering lifecycle behavior. Select an approved repository-owned command to verify that behavior.

minimal: storage classes — ["hot","archive"].

mid: retention days — 30.

maximal: delete before retention — false.
