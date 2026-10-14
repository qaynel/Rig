# development.code-creation.refactoring — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for refactoring. It checks preserved_behaviors (nonempty): preserved behaviors must name the concrete repository contract.. Binding checks: refactoring-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe code-creation.refactoring; bind it to the input named in `rig-services/development.code-creation.refactoring.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside code-creation.refactoring is a failure.

Acceptance target: fixture:development.code-creation.refactoring:policy-boundary. Given source-code is present and code-creation.refactoring is selected, pass only when the repository binding evaluates code-creation.refactoring and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Owned scope: `code-creation.refactoring`.

Offer: A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Input: `rig-services/development.code-creation.refactoring.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: refactoring configuration validation only; declared policy does not prove running refactoring behavior. Select an approved repository-owned command to verify that behavior.

minimal: preserved behaviors — ["public API returns unchanged values"].

mid: public api changes — 0.

maximal: rollback strategy — "revert-commit".
