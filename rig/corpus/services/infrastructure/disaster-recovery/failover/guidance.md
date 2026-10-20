# failover

Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Owned scope: `disaster-recovery.failover`. Input: `rig-services/infrastructure.disaster-recovery.failover.json`.

Coverage ceiling: Configuration validation only, so it confirms the failover trigger, fencing strategy and the split-brain flag are declared; it does not show failover works.

minimal: failover trigger — "primary health unavailable". Define what triggers failover. An undefined trigger means failover is manual or accidental, so state the health condition.

mid: fencing strategy — "single-writer-lease". Declare the fencing strategy that stops the old primary writing. Redundancy without fencing risks two writers, so name the mechanism.

maximal: allow split brain — false. Set allowing split-brain to false. Two writers corrupt data, so require fencing to complete before promotion.
