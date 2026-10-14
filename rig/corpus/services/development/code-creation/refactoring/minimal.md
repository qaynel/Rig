# development.code-creation.refactoring — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for refactoring. The minimal boundary for refactoring checks preserved_behaviors (nonempty): preserved behaviors must name the concrete repository contract.. Binding checks: refactoring-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe code-creation.refactoring; bind it to the input named in `rig-services/development.code-creation.refactoring.json` and preserve the check's failure status. When adopting this in an existing repository, connect refactoring to the command that inspects preserved_behaviors and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-creation.refactoring as a failure.

Acceptance target: fixture:development.code-creation.refactoring:policy-boundary. Given source-code is present and code-creation.refactoring is selected, pass only when the repository binding evaluates code-creation.refactoring and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern. The ceiling is refactoring configuration validation only; declared policy does not prove running refactoring behavior. Choose a repository-owned check that observes refactoring from rig-services/development.code-creation.refactoring.json..

Service-specific evidence cues:
Offer: A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.
minimal: preserved behaviors — ["public API returns unchanged values"].
mid: public api changes — 0.
maximal: rollback strategy — "revert-commit".
