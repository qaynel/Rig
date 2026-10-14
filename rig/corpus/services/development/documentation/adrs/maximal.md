# development.documentation.adrs — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for adrs. The evidence must preserve the decision, alternatives, consequences inputs that determined the result. Binding checks: adrs-evidence-receipt.

Ground the decision in a second run against unchanged adrs inputs. Record the decision, alternatives, consequences inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this adrs result is stale. The ceiling remains: adrs configuration validation only; declared policy does not prove running adrs behavior. Choose a repository-owned check that observes adrs from rig-services/development.documentation.adrs.json.

Acceptance target: fixture:development.documentation.adrs:evidence-replay. Given the documentation.adrs binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.
minimal: decision — "Use the existing journal for recovery".
mid: alternatives — ["overwrite files directly"].
maximal: consequences — ["recoverable preimages"].
