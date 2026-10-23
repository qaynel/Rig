# product-security.license-compliance.attribution — minimal

Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Policy grade, minimal: List the files holding each redistributed component's copyright and license notice, such as THIRD_PARTY_NOTICES. An empty list means notices cannot be traced, so add the real paths. Binding checks: attribution-source-code-boundary.

Acceptance target: policy:product-security.license-compliance.attribution:minimal:attribution-source-code-boundary.
Declared predicates: attribution-source-code-boundary: `notice_paths` is nonempty (a string or array).
