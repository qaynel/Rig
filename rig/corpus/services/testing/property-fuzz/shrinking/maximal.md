# testing.property-fuzz.shrinking — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for shrinking. The evidence must preserve the failure_predicate, preserved_constraints, drop_failure_during_shrink inputs that determined the result. Binding checks: shrinking-evidence-receipt.

Tie acceptance to a second run against unchanged shrinking inputs. Record the failure_predicate, preserved_constraints, drop_failure_during_shrink inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this shrinking result is stale. The ceiling remains: shrinking configuration validation only; declared policy does not prove running shrinking behavior. Choose a repository-owned check that observes shrinking from rig-services/testing.property-fuzz.shrinking.json.

Acceptance target: fixture:testing.property-fuzz.shrinking:evidence-replay. Given the property-fuzz.shrinking binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.
minimal: failure predicate — "parser crashes".
mid: preserved constraints — ["valid UTF-8"].
maximal: drop failure during shrink — false.
