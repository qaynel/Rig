# refactoring

A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Owned scope: `code-creation.refactoring`.

Offer: A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Input: `rig-services/development.code-creation.refactoring.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: refactoring configuration validation only; declared policy does not prove running refactoring behavior. Select an approved repository-owned command to verify that behavior.

minimal: preserved behaviors — ["public API returns unchanged values"].

mid: public api changes — 0.

maximal: rollback strategy — "revert-commit".
