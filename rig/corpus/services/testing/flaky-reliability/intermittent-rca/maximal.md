# testing.flaky-reliability.intermittent-rca — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for intermittent rca. The evidence must preserve the observed_conditions, reproduction_attempts, blame_randomness_without_evidence inputs that determined the result. Binding checks: intermittent-rca-evidence-receipt.

Tie acceptance to a second run against unchanged intermittent rca inputs. Record the observed_conditions, reproduction_attempts, blame_randomness_without_evidence inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this intermittent rca result is stale. The ceiling remains: intermittent rca configuration validation only; declared policy does not prove running intermittent rca behavior. Choose a repository-owned check that observes intermittent rca from rig-services/testing.flaky-reliability.intermittent-rca.json.

Acceptance target: fixture:testing.flaky-reliability.intermittent-rca:evidence-replay. Given the flaky-reliability.intermittent-rca binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.
minimal: observed conditions — ["parallel runs"].
mid: reproduction attempts — ["repeat with scheduler seed"].
maximal: blame randomness without evidence — false.
