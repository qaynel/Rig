# development.code-creation.refactoring — behavior-oracle slice

A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Policy grade slice. This slice bounds refactoring to code-creation.refactoring. It uses `refactoring-slice-behavior-oracle` and checks preserved_behaviors (nonempty): preserved behaviors must name the concrete repository contract.