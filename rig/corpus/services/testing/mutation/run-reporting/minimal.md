# testing.mutation.run-reporting — minimal

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Grade: minimal. Assurance remains Policy grade.

Include named outcomes such as killed, survived, and timeout so a report cannot hide inconclusive work.

Input: `rig-services/testing.mutation.run-reporting.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: Configuration validation only, so it confirms reported outcomes, the input revision and the raw-secret flag are declared; it does not produce a report.

Acceptance target: policy:testing.mutation.run-reporting:minimal:run-reporting-source-code-boundary.

Declared predicates: run-reporting-source-code-boundary: `reported_outcomes` is nonempty (a string or array).

Check: `run-reporting-source-code-boundary`.
