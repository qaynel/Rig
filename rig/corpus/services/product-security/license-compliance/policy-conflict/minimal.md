# product-security.license-compliance.policy-conflict — minimal

Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for policy conflict. The minimal boundary for policy conflict checks allowed_licenses (nonempty): allowed licenses must name the concrete repository contract. Binding checks: policy-conflict-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe license-compliance.policy-conflict; bind it to the input named in `rig-services/product-security.license-compliance.policy-conflict.json` and preserve the check's failure status. When adopting this in an existing repository, connect policy conflict to the command that inspects allowed_licenses and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside license-compliance.policy-conflict as a failure.

Acceptance target: policy:product-security.license-compliance.policy-conflict:minimal:policy-conflict-source-code-boundary.

Declared predicates: policy-conflict-source-code-boundary: `allowed_licenses` is nonempty (a string or array).
