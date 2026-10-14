# product-security.license-compliance.license-diff — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for license diff; it does not widen ownership beyond license-compliance.license-diff. The context signals are current_inventory. Binding checks: license-diff-license-compliance-context.

Read the existing repository's license diff convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in license-compliance under their own verdicts.

Acceptance target: fixture:product-security.license-compliance.license-diff:repository-context. Given license-compliance.license-diff has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent license compliance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Owned scope: `license-compliance.license-diff`.

Offer: Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Input: `rig-services/product-security.license-compliance.license-diff.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: license diff configuration validation only; declared policy does not prove running license diff behavior. Select an approved repository-owned command to verify that behavior.

minimal: previous inventory — "licenses.previous.json".

mid: current inventory — "licenses.current.json".

maximal: accept new licenses automatically — false.
