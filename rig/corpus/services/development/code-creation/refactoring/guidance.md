# refactoring

A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Owned scope: `code-creation.refactoring`. Input: `rig-services/development.code-creation.refactoring.json`.

Coverage ceiling: Configuration validation only, so it confirms preserved behaviors, a zero API-change count and a rollback route are declared; it does not show that behavior is unchanged.

minimal: preserved behaviors — ["public API returns unchanged values"]. List the behaviors the refactor must preserve. Without them nothing distinguishes restructuring from a behavior change, so name the observable contract.

mid: public api changes — 0. Public API changes must be 0. A refactor that alters a public surface is a feature change, so split it out or revise the declaration.

maximal: rollback strategy — "revert-commit". Record how to revert the restructuring. If the refactor misbehaves there is no way back otherwise, so name the commit, branch or command.
