# product-security.license-compliance.policy-conflict — maximal

Maximal adds a replayable evidence receipt for policy conflict. The evidence must preserve the allowed_licenses, restricted_licenses, ignore_license_conflicts inputs that determined the result.

Start from a second run against unchanged policy conflict inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.license-compliance.policy-conflict:evidence-replay. Given the license-compliance.policy-conflict binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
