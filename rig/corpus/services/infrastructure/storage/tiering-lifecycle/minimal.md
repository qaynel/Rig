# infrastructure.storage.tiering-lifecycle — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for tiering lifecycle. It checks storage_classes (nonempty): storage classes must name the concrete repository contract.. Binding checks: tiering-lifecycle-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe storage.tiering-lifecycle; bind it to the input named in `rig-services/infrastructure.storage.tiering-lifecycle.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside storage.tiering-lifecycle is a failure.

Acceptance target: fixture:infrastructure.storage.tiering-lifecycle:policy-boundary. Given source-code is present and storage.tiering-lifecycle is selected, pass only when the repository binding evaluates storage.tiering-lifecycle and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Owned scope: `storage.tiering-lifecycle`.

Offer: Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Input: `rig-services/infrastructure.storage.tiering-lifecycle.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: tiering lifecycle configuration validation only; declared policy does not prove running tiering lifecycle behavior. Select an approved repository-owned command to verify that behavior.

minimal: storage classes — ["hot","archive"].

mid: retention days — 30.

maximal: delete before retention — false.
