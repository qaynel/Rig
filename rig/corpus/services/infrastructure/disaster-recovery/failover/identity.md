# infrastructure.disaster-recovery.failover — identity

Policy grade: failover owns disaster-recovery.failover. Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Keep neighboring disaster-recovery services outside the failover decision for disaster-recovery.failover. Ground the decision in the configured input at `rig-services/infrastructure.disaster-recovery.failover.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: failover configuration validation only; declared policy does not prove running failover behavior. Choose a repository-owned check that observes failover from rig-services/infrastructure.disaster-recovery.failover.json.

Acceptance target: fixture:infrastructure.disaster-recovery.failover:policy-boundary. Given source-code is present and disaster-recovery.failover is selected, pass only when the repository binding evaluates disaster-recovery.failover and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern.

Service-specific evidence cues:
Offer: Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.
minimal: failover trigger — "primary health unavailable".
mid: fencing strategy — "single-writer-lease".
maximal: allow split brain — false.
