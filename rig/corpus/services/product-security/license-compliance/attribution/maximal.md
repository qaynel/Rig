# product-security.license-compliance.attribution — maximal

Maximal adds a replayable evidence receipt for attribution. The evidence must preserve the notice_paths, attributed_components, remove_required_notices inputs that determined the result.

Ground the decision in a second run against unchanged attribution inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: attribution configuration validation only; declared policy does not prove running attribution behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.license-compliance.attribution:evidence-replay. Given the license-compliance.attribution binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
