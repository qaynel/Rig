# infrastructure.provisioning.environment-parity — floor and mutation-floor slice

Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Policy grade slice `environment-parity-slice-floor`: List the environments compared. An unnamed environment is outside the check, so enumerate dev, staging and production as applicable.
