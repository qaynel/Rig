# testing.regression.change-impact — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for change impact. The evidence must preserve the changed_interfaces, affected_suites, select_by_filename_only inputs that determined the result. Binding checks: change-impact-evidence-receipt.

Trace the verdict to a second run against unchanged change impact inputs. Record the changed_interfaces, affected_suites, select_by_filename_only inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this change impact result is stale. The ceiling remains: change impact configuration validation only; declared policy does not prove running change impact behavior. Choose a repository-owned check that observes change impact from rig-services/testing.regression.change-impact.json.

Acceptance target: fixture:testing.regression.change-impact:evidence-replay. Given the regression.change-impact binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.
minimal: changed interfaces — ["order serializer"].
mid: affected suites — ["order contract"].
maximal: select by filename only — false.
