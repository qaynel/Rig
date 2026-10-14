# product-security.red-team.dast — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for dast. The evidence must preserve the target_origin, authorized_scope, scan_unapproved_targets inputs that determined the result. Binding checks: dast-evidence-receipt.

Ground the decision in a second run against unchanged dast inputs. Record the target_origin, authorized_scope, scan_unapproved_targets inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this dast result is stale. The ceiling remains: dast configuration validation only; declared policy does not prove running dast behavior. Choose a repository-owned check that observes dast from rig-services/product-security.red-team.dast.json.

Acceptance target: fixture:product-security.red-team.dast:evidence-replay. Given the red-team.dast binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.
minimal: target origin — "http://127.0.0.1:8080".
mid: authorized scope — ["/api"].
maximal: scan unapproved targets — false.
