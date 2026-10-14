# development.code-creation.refactoring — property-floor slice

Policy grade slice. This slice bounds refactoring to code-creation.refactoring. It uses `refactoring-slice-property-floor` and checks preserved_behaviors (nonempty): preserved behaviors must name the concrete repository contract..

For refactoring, choose a repository example that satisfies preserved_behaviors at the property-floor floor, plus a failure where preserved behaviors must name the concrete repository contract. is false. For refactoring, wire `property-floor` to `rig-services/development.code-creation.refactoring.json` and keep its verdict on preserved_behaviors; missing evidence is a named gap, with ceiling refactoring configuration validation only; declared policy does not prove running refactoring behavior. Choose a repository-owned check that observes refactoring from rig-services/development.code-creation.refactoring.json..

Service-specific evidence cues:
Offer: A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.
minimal: preserved behaviors — ["public API returns unchanged values"].
mid: public api changes — 0.
maximal: rollback strategy — "revert-commit".
