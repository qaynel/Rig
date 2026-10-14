# infrastructure.disaster-recovery.failover — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for failover. The evidence must preserve the failover_trigger, fencing_strategy, allow_split_brain inputs that determined the result. Binding checks: failover-evidence-receipt.

Anchor the review on a second run against unchanged failover inputs. Record the failover_trigger, fencing_strategy, allow_split_brain inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this failover result is stale. The ceiling remains: failover configuration validation only; declared policy does not prove running failover behavior. Choose a repository-owned check that observes failover from rig-services/infrastructure.disaster-recovery.failover.json.

Acceptance target: fixture:infrastructure.disaster-recovery.failover:evidence-replay. Given the disaster-recovery.failover binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.
minimal: failover trigger — "primary health unavailable".
mid: fencing strategy — "single-writer-lease".
maximal: allow split brain — false.
