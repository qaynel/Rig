# product-security.license-compliance.license-diff — mid

Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: license-diff-source-code-boundary, license-diff-license-compliance-context.

Read the existing repository's license diff convention, then name the source path or command that establishes it. For license diff, inspect the repository's actual spec, source, test, or configuration for current_inventory; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring license-compliance services outside the license diff decision for license-compliance.license-diff.

Acceptance target: policy:product-security.license-compliance.license-diff:mid:license-diff-source-code-boundary+license-diff-license-compliance-context.

Declared predicates: license-diff-source-code-boundary: `previous_inventory` is nonempty (a string or array); license-diff-license-compliance-context: `current_inventory` is nonempty (a string or array).
