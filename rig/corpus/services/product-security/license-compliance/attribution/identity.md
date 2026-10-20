# product-security.license-compliance.attribution — identity

Policy grade: attribution owns license-compliance.attribution. Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Keep neighboring license-compliance services outside the attribution decision for license-compliance.attribution. Anchor the review on the configured input at `rig-services/product-security.license-compliance.attribution.json`; malformed input is still attributed to that path.

Disposition: executable. Inspect the limit: attribution configuration validation only; declared policy does not prove running attribution behavior. Choose a repository-owned check that observes attribution from rig-services/product-security.license-compliance.attribution.json.

Acceptance target: policy:product-security.license-compliance.attribution:minimal:attribution-source-code-boundary.

Declared predicates: attribution-source-code-boundary: `notice_paths` is nonempty (a string or array).
