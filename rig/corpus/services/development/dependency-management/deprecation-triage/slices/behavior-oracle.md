# development.dependency-management.deprecation-triage — behavior-oracle slice

Policy grade slice. This slice bounds deprecation triage to dependency-management.deprecation-triage. It uses `deprecation-triage-slice-behavior-oracle` and checks deprecated_apis (nonempty): deprecated apis must name the concrete repository contract..

For deprecation triage, choose a repository example that satisfies deprecated_apis at the behavior-oracle floor, plus a failure where deprecated apis must name the concrete repository contract. is false. For deprecation triage, wire `behavior-oracle` to `rig-services/development.dependency-management.deprecation-triage.json` and keep its verdict on deprecated_apis; missing evidence is a named gap, with ceiling deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Choose a repository-owned check that observes deprecation triage from rig-services/development.dependency-management.deprecation-triage.json..

Service-specific evidence cues:
Offer: Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.
minimal: deprecated apis — ["legacyClient"].
mid: replacement owners — ["platform"].
maximal: ignore removal deadline — false.
