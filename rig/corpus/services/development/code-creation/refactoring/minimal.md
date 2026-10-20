# development.code-creation.refactoring — minimal

A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for refactoring. The minimal boundary for refactoring checks preserved_behaviors (nonempty): preserved behaviors must name the concrete repository contract. Binding checks: refactoring-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe code-creation.refactoring; bind it to the input named in `rig-services/development.code-creation.refactoring.json` and preserve the check's failure status. When adopting this in an existing repository, connect refactoring to the command that inspects preserved_behaviors and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-creation.refactoring as a failure.

Acceptance target: policy:development.code-creation.refactoring:minimal:refactoring-source-code-boundary.

Declared predicates: refactoring-source-code-boundary: `preserved_behaviors` is nonempty (a string or array).
