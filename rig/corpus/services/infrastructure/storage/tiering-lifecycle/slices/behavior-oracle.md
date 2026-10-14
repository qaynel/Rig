# infrastructure.storage.tiering-lifecycle — behavior-oracle slice

Policy grade slice. This slice bounds tiering lifecycle to storage.tiering-lifecycle. It uses `tiering-lifecycle-slice-behavior-oracle` and checks storage_classes (nonempty): storage classes must name the concrete repository contract..

For tiering lifecycle, choose a repository example that satisfies storage_classes at the behavior-oracle floor, plus a failure where storage classes must name the concrete repository contract. is false. For tiering lifecycle, wire `behavior-oracle` to `rig-services/infrastructure.storage.tiering-lifecycle.json` and keep its verdict on storage_classes; missing evidence is a named gap, with ceiling tiering lifecycle configuration validation only; declared policy does not prove running tiering lifecycle behavior. Choose a repository-owned check that observes tiering lifecycle from rig-services/infrastructure.storage.tiering-lifecycle.json..

Service-specific evidence cues:
Offer: Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.
minimal: storage classes — ["hot","archive"].
mid: retention days — 30.
maximal: delete before retention — false.
