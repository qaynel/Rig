# testing.mutation.remediation-advisor — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for remediation advisor. The evidence must preserve the remediation_cases, target_behaviors, add_implementation_mirrors inputs that determined the result. Binding checks: remediation-advisor-evidence-receipt.

Inspect a second run against unchanged remediation advisor inputs. Record the remediation_cases, target_behaviors, add_implementation_mirrors inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this remediation advisor result is stale. The ceiling remains: remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Choose a repository-owned check that observes remediation advisor from rig-services/testing.mutation.remediation-advisor.json.

Acceptance target: fixture:testing.mutation.remediation-advisor:evidence-replay. Given the mutation.remediation-advisor binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.
minimal: remediation cases — ["reject exact upper limit"].
mid: target behaviors — ["limit enforcement"].
maximal: add implementation mirrors — false.
