# product-security.license-compliance.attribution — mid

Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: attribution-source-code-boundary, attribution-license-compliance-context.

Read the existing repository's attribution convention, then name the source path or command that establishes it. For attribution, inspect the repository's actual spec, source, test, or configuration for attributed_components; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring license-compliance services outside the attribution decision for license-compliance.attribution.

Acceptance target: policy:product-security.license-compliance.attribution:mid:attribution-source-code-boundary+attribution-license-compliance-context.

Declared predicates: attribution-source-code-boundary: `notice_paths` is nonempty (a string or array); attribution-license-compliance-context: `attributed_components` is nonempty (a string or array).
