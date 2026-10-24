# testing.mutation.run-reporting — identity

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Policy grade. Report killed, survived, and inconclusive outcomes against the exact input revision. Raw secrets in mutation inputs or output must not leave the producing environment.

Applicable surface: source-code.

Owned scope: `mutation.run-reporting`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. Configuration validation only, so it confirms reported outcomes, the input revision and the raw-secret flag are declared; it does not produce a report.

Policy checks: minimal requires `reported_outcomes` = `["killed","survived","timeout"]`; mid adds `input_revision` = `"a1b2c3d"`; maximal requires `publish_raw_secrets` = `false`.
