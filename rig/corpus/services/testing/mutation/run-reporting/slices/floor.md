# testing.mutation.run-reporting — floor slice

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Assurance remains Policy grade.

Include named outcomes such as killed, survived, and timeout so a report cannot hide inconclusive work. Configuration validation only, so it confirms reported outcomes, the input revision and the raw-secret flag are declared; it does not produce a report.
