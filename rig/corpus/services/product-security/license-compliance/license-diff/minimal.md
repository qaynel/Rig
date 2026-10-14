# product-security.license-compliance.license-diff — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for license diff. The minimal boundary for license diff checks previous_inventory (nonempty): previous inventory must name the concrete repository contract.. Binding checks: license-diff-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe license-compliance.license-diff; bind it to the input named in `rig-services/product-security.license-compliance.license-diff.json` and preserve the check's failure status. When adopting this in an existing repository, connect license diff to the command that inspects previous_inventory and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside license-compliance.license-diff as a failure.

Acceptance target: fixture:product-security.license-compliance.license-diff:policy-boundary. Given source-code is present and license-compliance.license-diff is selected, pass only when the repository binding evaluates license-compliance.license-diff and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern. The ceiling is license diff configuration validation only; declared policy does not prove running license diff behavior. Choose a repository-owned check that observes license diff from rig-services/product-security.license-compliance.license-diff.json..

Service-specific evidence cues:
Offer: Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.
minimal: previous inventory — "licenses.previous.json".
mid: current inventory — "licenses.current.json".
maximal: accept new licenses automatically — false.
