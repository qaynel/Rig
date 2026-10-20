# product-security.license-compliance.attribution — identity

Policy grade: attribution owns license-compliance.attribution. Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Input: `rig-services/product-security.license-compliance.attribution.json`. Configuration validation only, so it confirms notice paths, attributed components and the notice-removal flag are declared; it does not show the shipped artifact carries those notices.

Disposition: executable.
Acceptance target: policy:product-security.license-compliance.attribution:minimal:attribution-source-code-boundary.
Declared predicates: attribution-source-code-boundary: `notice_paths` is nonempty (a string or array).
