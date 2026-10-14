# development.code-creation.refactoring — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for refactoring. The evidence must preserve the preserved_behaviors, public_api_changes, rollback_strategy inputs that determined the result. Binding checks: refactoring-evidence-receipt.

Start from a second run against unchanged refactoring inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: refactoring configuration validation only; declared policy does not prove running refactoring behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-creation.refactoring:evidence-replay. Given the code-creation.refactoring binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Owned scope: `code-creation.refactoring`.

Offer: A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Input: `rig-services/development.code-creation.refactoring.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: refactoring configuration validation only; declared policy does not prove running refactoring behavior. Select an approved repository-owned command to verify that behavior.

minimal: preserved behaviors — ["public API returns unchanged values"].

mid: public api changes — 0.

maximal: rollback strategy — "revert-commit".
