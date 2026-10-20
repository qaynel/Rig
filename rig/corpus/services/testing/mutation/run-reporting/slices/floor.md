# testing.mutation.run-reporting — floor slice

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Assurance remains Policy grade.

This Policy slice checks `reported_outcomes` through `run-reporting-slice-floor`. The good fixture supplies `reported_outcomes` = `["killed","survived","timeout"]`; the bad fixture removes it.

Include named outcomes such as killed, survived, and timeout so a report cannot hide inconclusive work. Keep the failure attached to `rig-services/testing.mutation.run-reporting.json`; do not infer that a mutation was generated or killed. run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior.
