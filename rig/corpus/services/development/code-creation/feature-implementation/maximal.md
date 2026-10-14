# development.code-creation.feature-implementation — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for feature implementation. The evidence must preserve the acceptance_cases, change_scope, compatibility inputs that determined the result. Binding checks: feature-implementation-evidence-receipt.

Anchor the review on a second run against unchanged feature implementation inputs. Record the acceptance_cases, change_scope, compatibility inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this feature implementation result is stale. The ceiling remains: feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Choose a repository-owned check that observes feature implementation from rig-services/development.code-creation.feature-implementation.json.

Acceptance target: fixture:development.code-creation.feature-implementation:evidence-replay. Given the code-creation.feature-implementation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.
minimal: acceptance cases — ["creates an item","rejects invalid input"].
mid: change scope — ["src/items.js"].
maximal: compatibility — "preserve-existing-behavior".
