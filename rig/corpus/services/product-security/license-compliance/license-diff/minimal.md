# product-security.license-compliance.license-diff — minimal

Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for license diff. The minimal boundary for license diff checks previous_inventory (nonempty): previous inventory must name the concrete repository contract. Binding checks: license-diff-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe license-compliance.license-diff; bind it to the input named in `rig-services/product-security.license-compliance.license-diff.json` and preserve the check's failure status. When adopting this in an existing repository, connect license diff to the command that inspects previous_inventory and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside license-compliance.license-diff as a failure.

Acceptance target: policy:product-security.license-compliance.license-diff:minimal:license-diff-source-code-boundary.

Declared predicates: license-diff-source-code-boundary: `previous_inventory` is nonempty (a string or array).
