# run reporting

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Assurance remains Policy grade.

Report killed, survived, and inconclusive outcomes against the exact input revision. Raw secrets in mutation inputs or output must not leave the producing environment.

The policy input is `rig-services/testing.mutation.run-reporting.json`. Keep its configuration visible to review: minimal supplies `reported_outcomes` = `["killed","survived","timeout"]`; mid adds `input_revision` = `"a1b2c3d"`; maximal sets `publish_raw_secrets` = `false`.


The native check validates this service’s declared policy only; it does not run the service. For runtime assurance, run an approved repository-owned command and preserve its exit status.
