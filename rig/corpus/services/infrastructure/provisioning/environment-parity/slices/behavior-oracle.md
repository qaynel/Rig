# infrastructure.provisioning.environment-parity — behavior-oracle slice

Policy grade slice. This slice bounds environment parity to provisioning.environment-parity. It uses `environment-parity-slice-behavior-oracle` and checks environments (nonempty): environments must name the concrete repository contract..

For environment parity, choose a repository example that satisfies environments at the behavior-oracle floor, plus a failure where environments must name the concrete repository contract. is false. For environment parity, wire `behavior-oracle` to `rig-services/infrastructure.provisioning.environment-parity.json` and keep its verdict on environments; missing evidence is a named gap, with ceiling environment parity configuration validation only; declared policy does not prove running environment parity behavior. Choose a repository-owned check that observes environment parity from rig-services/infrastructure.provisioning.environment-parity.json..

Service-specific evidence cues:
Offer: Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.
minimal: environments — ["staging","production"].
mid: intentional differences — ["instance count"].
maximal: unrecorded differences allowed — false.
