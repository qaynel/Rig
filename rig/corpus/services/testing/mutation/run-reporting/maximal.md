# testing.mutation.run-reporting — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for run reporting. The evidence must preserve the reported_outcomes, input_revision, publish_raw_secrets inputs that determined the result. Binding checks: run-reporting-evidence-receipt.

Start from a second run against unchanged run reporting inputs. Record the reported_outcomes, input_revision, publish_raw_secrets inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this run reporting result is stale. The ceiling remains: run reporting configuration validation only; declared policy does not prove running run reporting behavior. Choose a repository-owned check that observes run reporting from rig-services/testing.mutation.run-reporting.json.

Acceptance target: fixture:testing.mutation.run-reporting:evidence-replay. Given the mutation.run-reporting binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.
minimal: reported outcomes — ["killed","survived","timeout"].
mid: input revision — "a1b2c3d".
maximal: publish raw secrets — false.
