# infrastructure.storage.tiering-lifecycle — identity

Policy grade: tiering lifecycle owns storage.tiering-lifecycle. Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Keep neighboring storage services outside the tiering lifecycle decision for storage.tiering-lifecycle. Trace the verdict to the configured input at `rig-services/infrastructure.storage.tiering-lifecycle.json`; malformed input is still attributed to that path.

Disposition: convention. Anchor the review on the limit: tiering lifecycle configuration validation only; declared policy does not prove running tiering lifecycle behavior. Choose a repository-owned check that observes tiering lifecycle from rig-services/infrastructure.storage.tiering-lifecycle.json.

Acceptance target: fixture:infrastructure.storage.tiering-lifecycle:policy-boundary. Given source-code is present and storage.tiering-lifecycle is selected, pass only when the repository binding evaluates storage.tiering-lifecycle and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern.

Service-specific evidence cues:
Offer: Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.
minimal: storage classes — ["hot","archive"].
mid: retention days — 30.
maximal: delete before retention — false.
