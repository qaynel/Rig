# product-security.license-compliance.attribution — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for attribution; it does not widen ownership beyond license-compliance.attribution. The context signals are attributed_components. Binding checks: attribution-license-compliance-context.

Read the existing repository's attribution convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in license-compliance under their own verdicts.

Acceptance target: fixture:product-security.license-compliance.attribution:repository-context. Given license-compliance.attribution has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent license compliance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Owned scope: `license-compliance.attribution`.

Offer: Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Input: `rig-services/product-security.license-compliance.attribution.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: attribution configuration validation only; declared policy does not prove running attribution behavior. Select an approved repository-owned command to verify that behavior.

minimal: notice paths — ["THIRD_PARTY_NOTICES"].

mid: attributed components — ["library@1.0.0"].

maximal: remove required notices — false.
