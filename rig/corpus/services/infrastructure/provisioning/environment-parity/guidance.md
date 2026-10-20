# environment-parity

Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Owned scope: `provisioning.environment-parity`. Input: `rig-services/infrastructure.provisioning.environment-parity.json`.

Coverage ceiling: Configuration validation only, so it confirms environments, intentional differences and the unrecorded-difference flag are declared; it does not compare deployed resources.

minimal: environments — ["staging","production"]. List the environments compared. An unnamed environment is outside the check, so enumerate dev, staging and production as applicable.

mid: intentional differences — ["instance count"]. Record the differences that are intentional. Unexplained differences are drift, so document each deliberate one.

maximal: unrecorded differences allowed — false. Set unrecorded differences allowed to false. A hidden difference makes staging results meaningless, so record or remove it.
