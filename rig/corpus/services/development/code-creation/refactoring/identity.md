# development.code-creation.refactoring — identity

Policy grade: refactoring owns code-creation.refactoring. A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Keep neighboring code-creation services outside the refactoring decision for code-creation.refactoring. Tie acceptance to the configured input at `rig-services/development.code-creation.refactoring.json`; malformed input is still attributed to that path.

Disposition: executable. Read the limit: refactoring configuration validation only; declared policy does not prove running refactoring behavior. Choose a repository-owned check that observes refactoring from rig-services/development.code-creation.refactoring.json.

Acceptance target: policy:development.code-creation.refactoring:minimal:refactoring-source-code-boundary.

Declared predicates: refactoring-source-code-boundary: `preserved_behaviors` is nonempty (a string or array).
