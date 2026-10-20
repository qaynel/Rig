# development.code-creation.refactoring — property-floor slice

A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Policy grade slice. This slice bounds refactoring to code-creation.refactoring. It uses `refactoring-slice-property-floor` and checks preserved_behaviors (nonempty): preserved behaviors must name the concrete repository contract.