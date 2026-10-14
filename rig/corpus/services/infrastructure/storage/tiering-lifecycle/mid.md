# infrastructure.storage.tiering-lifecycle — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for tiering lifecycle; it does not widen ownership beyond storage.tiering-lifecycle. The context signals are retention_days. Binding checks: tiering-lifecycle-storage-context.

Tie acceptance to the existing repository's tiering lifecycle convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in storage under their own verdicts.

Acceptance target: fixture:infrastructure.storage.tiering-lifecycle:repository-context. Given storage.tiering-lifecycle has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent storage concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Owned scope: `storage.tiering-lifecycle`.

Offer: Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Input: `rig-services/infrastructure.storage.tiering-lifecycle.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: tiering lifecycle configuration validation only; declared policy does not prove running tiering lifecycle behavior. Select an approved repository-owned command to verify that behavior.

minimal: storage classes — ["hot","archive"].

mid: retention days — 30.

maximal: delete before retention — false.
