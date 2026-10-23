# development.code-creation.refactoring — property-floor slice

A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Policy grade slice `refactoring-slice-property-floor`: List the behaviors the refactor must preserve. Without them nothing distinguishes restructuring from a behavior change, so name the observable contract.
