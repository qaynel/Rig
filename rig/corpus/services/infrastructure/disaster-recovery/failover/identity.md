# infrastructure.disaster-recovery.failover — identity

Policy grade: failover owns disaster-recovery.failover. Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Input: `rig-services/infrastructure.disaster-recovery.failover.json`. Configuration validation only, so it confirms the failover trigger, fencing strategy and the split-brain flag are declared; it does not show failover works.

Disposition: executable.
Acceptance target: policy:infrastructure.disaster-recovery.failover:minimal:failover-source-code-boundary.
Declared predicates: failover-source-code-boundary: `failover_trigger` is nonempty (a string or array).
