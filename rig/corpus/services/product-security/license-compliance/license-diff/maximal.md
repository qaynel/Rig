# product-security.license-compliance.license-diff — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for license diff. The evidence must preserve the previous_inventory, current_inventory, accept_new_licenses_automatically inputs that determined the result. Binding checks: license-diff-evidence-receipt.

Ground the decision in a second run against unchanged license diff inputs. Record the previous_inventory, current_inventory, accept_new_licenses_automatically inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this license diff result is stale. The ceiling remains: license diff configuration validation only; declared policy does not prove running license diff behavior. Choose a repository-owned check that observes license diff from rig-services/product-security.license-compliance.license-diff.json.

Acceptance target: fixture:product-security.license-compliance.license-diff:evidence-replay. Given the license-compliance.license-diff binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.
minimal: previous inventory — "licenses.previous.json".
mid: current inventory — "licenses.current.json".
maximal: accept new licenses automatically — false.
