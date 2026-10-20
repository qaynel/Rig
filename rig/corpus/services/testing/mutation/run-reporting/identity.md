# testing.mutation.run-reporting — identity

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Policy grade. Report killed, survived, and inconclusive outcomes against the exact input revision. Raw secrets in mutation inputs or output must not leave the producing environment.

Applicable surface: source-code.

Owned scope: `mutation.run-reporting`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Read `rig-services/testing.mutation.run-reporting.json`; malformed input remains attributable to that path. The good and bad fixtures show the configuration boundary, not a mutation run.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior.

Policy checks: minimal requires `reported_outcomes` = `["killed","survived","timeout"]`; mid adds `input_revision` = `"a1b2c3d"`; maximal requires `publish_raw_secrets` = `false`.
