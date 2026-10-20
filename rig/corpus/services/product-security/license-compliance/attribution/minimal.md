# product-security.license-compliance.attribution — minimal

Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for attribution. The minimal boundary for attribution checks notice_paths (nonempty): notice paths must name the concrete repository contract. Binding checks: attribution-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe license-compliance.attribution; bind it to the input named in `rig-services/product-security.license-compliance.attribution.json` and preserve the check's failure status. When adopting this in an existing repository, connect attribution to the command that inspects notice_paths and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside license-compliance.attribution as a failure.

Acceptance target: policy:product-security.license-compliance.attribution:minimal:attribution-source-code-boundary.

Declared predicates: attribution-source-code-boundary: `notice_paths` is nonempty (a string or array).
