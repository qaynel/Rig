# product-security.license-compliance.policy-conflict — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for policy conflict. The evidence must preserve the allowed_licenses, restricted_licenses, ignore_license_conflicts inputs that determined the result. Binding checks: policy-conflict-evidence-receipt.

Start from a second run against unchanged policy conflict inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.license-compliance.policy-conflict:evidence-replay. Given the license-compliance.policy-conflict binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Owned scope: `license-compliance.policy-conflict`.

Offer: Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Input: `rig-services/product-security.license-compliance.policy-conflict.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Select an approved repository-owned command to verify that behavior.

minimal: allowed licenses — ["MIT","Apache-2.0"].

mid: restricted licenses — ["AGPL-3.0-only"].

maximal: ignore license conflicts — false.
