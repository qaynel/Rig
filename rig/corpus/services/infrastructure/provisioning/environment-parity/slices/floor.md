# infrastructure.provisioning.environment-parity — floor and mutation-floor slice

Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Policy grade slice. This slice bounds environment parity to provisioning.environment-parity. It uses `environment-parity-slice-floor` and checks environments (nonempty): environments must name the concrete repository contract.