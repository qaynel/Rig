# environment parity

Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Owned scope: `provisioning.environment-parity`.

Offer: Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Input: `rig-services/infrastructure.provisioning.environment-parity.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: environment parity configuration validation only; declared policy does not prove running environment parity behavior. Select an approved repository-owned command to verify that behavior.

minimal: environments — ["staging","production"].

mid: intentional differences — ["instance count"].

maximal: unrecorded differences allowed — false.
