# infrastructure.provisioning.environment-parity — behavior-oracle slice

Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Policy grade slice `environment-parity-slice-behavior-oracle`: List the environments compared. An unnamed environment is outside the check, so enumerate dev, staging and production as applicable. Despite its name this slice is not a behavior oracle: it confirms environments, intentional differences and the unrecorded-difference flag are declared; it does not compare deployed resources.
