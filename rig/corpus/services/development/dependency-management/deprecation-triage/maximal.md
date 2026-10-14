# development.dependency-management.deprecation-triage — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for deprecation triage. The evidence must preserve the deprecated_apis, replacement_owners, ignore_removal_deadline inputs that determined the result. Binding checks: deprecation-triage-evidence-receipt.

Anchor the review on a second run against unchanged deprecation triage inputs. Record the deprecated_apis, replacement_owners, ignore_removal_deadline inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this deprecation triage result is stale. The ceiling remains: deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Choose a repository-owned check that observes deprecation triage from rig-services/development.dependency-management.deprecation-triage.json.

Acceptance target: fixture:development.dependency-management.deprecation-triage:evidence-replay. Given the dependency-management.deprecation-triage binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.
minimal: deprecated apis — ["legacyClient"].
mid: replacement owners — ["platform"].
maximal: ignore removal deadline — false.
