# infrastructure.disaster-recovery.failover — minimal

Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Policy grade, minimal: Define what triggers failover. An undefined trigger means failover is manual or accidental, so state the health condition. Binding checks: failover-source-code-boundary.

Acceptance target: policy:infrastructure.disaster-recovery.failover:minimal:failover-source-code-boundary.
Declared predicates: failover-source-code-boundary: `failover_trigger` is nonempty (a string or array).
