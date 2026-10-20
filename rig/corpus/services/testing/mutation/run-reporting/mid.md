# testing.mutation.run-reporting — mid

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Policy grade, mid: Record the exact input revision of the run. A report without a revision cannot be tied to code, so name the commit. Cumulative with minimal. Binding checks: run-reporting-source-code-boundary, run-reporting-mutation-context.
