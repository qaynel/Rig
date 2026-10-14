# infrastructure.provisioning.environment-parity — behavior-oracle slice

Policy grade slice. This slice bounds environment parity to provisioning.environment-parity. It uses `environment-parity-slice-behavior-oracle` and checks environments (nonempty): environments must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.provisioning.environment-parity.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than environment parity configuration validation only; declared policy does not prove running environment parity behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Owned scope: `provisioning.environment-parity`.

Offer: Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Input: `rig-services/infrastructure.provisioning.environment-parity.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: environment parity configuration validation only; declared policy does not prove running environment parity behavior. Select an approved repository-owned command to verify that behavior.

minimal: environments — ["staging","production"].

mid: intentional differences — ["instance count"].

maximal: unrecorded differences allowed — false.
