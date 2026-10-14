# development.documentation.adrs — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for adrs. The evidence must preserve the decision, alternatives, consequences inputs that determined the result. Binding checks: adrs-evidence-receipt.

Ground the decision in a second run against unchanged adrs inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: adrs configuration validation only; declared policy does not prove running adrs behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.documentation.adrs:evidence-replay. Given the documentation.adrs binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Owned scope: `documentation.adrs`.

Offer: Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Input: `rig-services/development.documentation.adrs.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: adrs configuration validation only; declared policy does not prove running adrs behavior. Select an approved repository-owned command to verify that behavior.

minimal: decision — "Use the existing journal for recovery".

mid: alternatives — ["overwrite files directly"].

maximal: consequences — ["recoverable preimages"].
