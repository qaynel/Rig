# development.dependency-management.deprecation-triage — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for deprecation triage. The evidence must preserve the deprecated_apis, replacement_owners, ignore_removal_deadline inputs that determined the result. Binding checks: deprecation-triage-evidence-receipt.

Anchor the review on a second run against unchanged deprecation triage inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.dependency-management.deprecation-triage:evidence-replay. Given the dependency-management.deprecation-triage binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Owned scope: `dependency-management.deprecation-triage`.

Offer: Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Input: `rig-services/development.dependency-management.deprecation-triage.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Select an approved repository-owned command to verify that behavior.

minimal: deprecated apis — ["legacyClient"].

mid: replacement owners — ["platform"].

maximal: ignore removal deadline — false.
