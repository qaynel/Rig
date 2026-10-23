# product-security.license-compliance.attribution — mid

Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Policy grade, mid: List the third-party components that are attributed, with versions. A component missing from the list ships without credit, so enumerate them. Cumulative with minimal. Binding checks: attribution-source-code-boundary, attribution-license-compliance-context.

Acceptance target: policy:product-security.license-compliance.attribution:mid:attribution-source-code-boundary+attribution-license-compliance-context.
Declared predicates: attribution-source-code-boundary: `notice_paths` is nonempty (a string or array); attribution-license-compliance-context: `attributed_components` is nonempty (a string or array).
