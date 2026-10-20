# testing.mutation.run-reporting — minimal

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Grade: minimal. Assurance remains Policy grade. This check rejects a policy with no reported_outcomes: the bad fixture has `reported_outcomes` = `[]`, while the accepted fixture has `reported_outcomes` = `["killed","survived","timeout"]`.

List at least one value for `reported_outcomes`. The result says only that the configured operator or input is present. Include named outcomes such as killed, survived, and timeout so a report cannot hide inconclusive work.

Input: `rig-services/testing.mutation.run-reporting.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: policy:testing.mutation.run-reporting:minimal:run-reporting-source-code-boundary.

Declared predicates: run-reporting-source-code-boundary: `reported_outcomes` is nonempty (a string or array).

Check: `run-reporting-source-code-boundary`.
