# development.code-creation.refactoring — behavior-oracle slice

A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Policy grade slice `refactoring-slice-behavior-oracle`: List the behaviors the refactor must preserve. Without them nothing distinguishes restructuring from a behavior change, so name the observable contract. Despite its name this slice is not a behavior oracle: it confirms preserved behaviors, a zero API-change count and a rollback route are declared; it does not show that behavior is unchanged.
