# infrastructure.provisioning.environment-parity — behavior-oracle slice

Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Policy grade slice. This slice bounds environment parity to provisioning.environment-parity. It uses `environment-parity-slice-behavior-oracle` and checks environments (nonempty): environments must name the concrete repository contract.