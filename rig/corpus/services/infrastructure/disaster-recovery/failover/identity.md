# infrastructure.disaster-recovery.failover — identity

Policy grade: failover owns disaster-recovery.failover. Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Keep neighboring disaster-recovery services outside the failover decision for disaster-recovery.failover. Ground the decision in the configured input at `rig-services/infrastructure.disaster-recovery.failover.json`; malformed input is still attributed to that path.

Disposition: executable. Use the limit: failover configuration validation only; declared policy does not prove running failover behavior. Choose a repository-owned check that observes failover from rig-services/infrastructure.disaster-recovery.failover.json.

Acceptance target: policy:infrastructure.disaster-recovery.failover:minimal:failover-source-code-boundary.

Declared predicates: failover-source-code-boundary: `failover_trigger` is nonempty (a string or array).
