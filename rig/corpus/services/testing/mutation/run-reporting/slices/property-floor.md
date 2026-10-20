# testing.mutation.run-reporting — property-floor slice

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Assurance remains Policy grade.

This slice verifies the configured `reported_outcomes` rule using `run-reporting-slice-property-floor`. Report killed, survived, and inconclusive outcomes against the exact input revision.

The accepted fixture contains `reported_outcomes` = `["killed","survived","timeout"]`; the invalid fixture demonstrates the missing-field case. This checks policy shape only, not a property of generated mutants.
