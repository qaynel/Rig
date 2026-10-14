# product-security.license-compliance.attribution — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for attribution; it does not widen ownership beyond license-compliance.attribution. For attribution, inspect these context signals: attributed_components. Binding checks: attribution-license-compliance-context.

Read the existing repository's attribution convention, then name the source path or command that establishes it. For attribution, inspect the repository's actual spec, source, test, or configuration for attributed_components; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring license-compliance services outside the attribution decision for license-compliance.attribution.

Acceptance target: fixture:product-security.license-compliance.attribution:repository-context. Given license-compliance.attribution has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent license compliance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.
minimal: notice paths — ["THIRD_PARTY_NOTICES"].
mid: attributed components — ["library@1.0.0"].
maximal: remove required notices — false.
