# product-security.license-compliance.policy-conflict — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for policy conflict. The evidence must preserve the allowed_licenses, restricted_licenses, ignore_license_conflicts inputs that determined the result. Binding checks: policy-conflict-evidence-receipt.

Start from a second run against unchanged policy conflict inputs. Record the allowed_licenses, restricted_licenses, ignore_license_conflicts inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this policy conflict result is stale. The ceiling remains: policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Choose a repository-owned check that observes policy conflict from rig-services/product-security.license-compliance.policy-conflict.json.

Acceptance target: fixture:product-security.license-compliance.policy-conflict:evidence-replay. Given the license-compliance.policy-conflict binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.
minimal: allowed licenses — ["MIT","Apache-2.0"].
mid: restricted licenses — ["AGPL-3.0-only"].
maximal: ignore license conflicts — false.
