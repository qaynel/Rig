# development.architecture.tech-debt — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for tech debt. The evidence must preserve the debt_items, owners, exit_criteria inputs that determined the result. Binding checks: tech-debt-evidence-receipt.

Ground the decision in a second run against unchanged tech debt inputs. Record the debt_items, owners, exit_criteria inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this tech debt result is stale. The ceiling remains: tech debt configuration validation only; declared policy does not prove running tech debt behavior. Choose a repository-owned check that observes tech debt from rig-services/development.architecture.tech-debt.json.

Acceptance target: fixture:development.architecture.tech-debt:evidence-replay. Given the architecture.tech-debt binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.
minimal: debt items — ["replace duplicated parser"].
mid: owners — ["platform"].
maximal: exit criteria — ["single parser with compatibility checks"].
