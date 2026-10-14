# product-security.license-compliance.license-diff — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for license diff; it does not widen ownership beyond license-compliance.license-diff. For license diff, inspect these context signals: current_inventory. Binding checks: license-diff-license-compliance-context.

Read the existing repository's license diff convention, then name the source path or command that establishes it. For license diff, inspect the repository's actual spec, source, test, or configuration for current_inventory; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring license-compliance services outside the license diff decision for license-compliance.license-diff.

Acceptance target: fixture:product-security.license-compliance.license-diff:repository-context. Given license-compliance.license-diff has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent license compliance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.
minimal: previous inventory — "licenses.previous.json".
mid: current inventory — "licenses.current.json".
maximal: accept new licenses automatically — false.
