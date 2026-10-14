# development.architecture.tech-debt — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for tech debt. The evidence must preserve the debt_items, owners, exit_criteria inputs that determined the result. Binding checks: tech-debt-evidence-receipt.

Ground the decision in a second run against unchanged tech debt inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: tech debt configuration validation only; declared policy does not prove running tech debt behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.architecture.tech-debt:evidence-replay. Given the architecture.tech-debt binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Owned scope: `architecture.tech-debt`.

Offer: Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Input: `rig-services/development.architecture.tech-debt.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: tech debt configuration validation only; declared policy does not prove running tech debt behavior. Select an approved repository-owned command to verify that behavior.

minimal: debt items — ["replace duplicated parser"].

mid: owners — ["platform"].

maximal: exit criteria — ["single parser with compatibility checks"].
