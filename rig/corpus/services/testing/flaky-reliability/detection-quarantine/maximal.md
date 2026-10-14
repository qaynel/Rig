# testing.flaky-reliability.detection-quarantine — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for detection quarantine. The evidence must preserve the flaky_cases, quarantine_owners, silent_quarantine inputs that determined the result. Binding checks: detection-quarantine-evidence-receipt.

Use a second run against unchanged detection quarantine inputs. Record the flaky_cases, quarantine_owners, silent_quarantine inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this detection quarantine result is stale. The ceiling remains: detection quarantine configuration validation only; declared policy does not prove running detection quarantine behavior. Choose a repository-owned check that observes detection quarantine from rig-services/testing.flaky-reliability.detection-quarantine.json.

Acceptance target: fixture:testing.flaky-reliability.detection-quarantine:evidence-replay. Given the flaky-reliability.detection-quarantine binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.
minimal: flaky cases — ["slow websocket reconnect"].
mid: quarantine owners — ["realtime"].
maximal: silent quarantine — false.
