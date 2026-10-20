# testing.mutation.run-reporting — maximal

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: run-reporting-source-code-boundary, run-reporting-mutation-context, run-reporting-evidence-receipt.

Keep `publish_raw_secrets` equal to false. Keep raw-secret publication disabled; policy validation does not prove the report redacts every output path.

Maximal here adds a configuration guard, not an evidence receipt or a demonstrated mutation outcome. run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior.

Evidence-replay target (not established by this policy check): policy:testing.mutation.run-reporting:maximal:run-reporting-source-code-boundary+run-reporting-mutation-context+run-reporting-evidence-receipt.

Check: `run-reporting-evidence-receipt`.
