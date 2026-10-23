# development.code-creation.refactoring — identity

Policy grade: refactoring owns code-creation.refactoring. A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Input: `rig-services/development.code-creation.refactoring.json`. Configuration validation only, so it confirms preserved behaviors, a zero API-change count and a rollback route are declared; it does not show that behavior is unchanged.

Disposition: executable.
Acceptance target: policy:development.code-creation.refactoring:minimal:refactoring-source-code-boundary.
Declared predicates: refactoring-source-code-boundary: `preserved_behaviors` is nonempty (a string or array).
