# testing.mutation.run-reporting — maximal

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Policy grade, maximal: Set publishing raw secrets to false. Reports leave the producing environment, so redact sensitive input first. Cumulative with minimal and mid. Binding checks: run-reporting-source-code-boundary, run-reporting-mutation-context, run-reporting-evidence-receipt.
