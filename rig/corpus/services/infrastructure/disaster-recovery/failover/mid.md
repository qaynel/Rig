# infrastructure.disaster-recovery.failover — mid

Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Policy grade, mid: Declare the fencing strategy that stops the old primary writing. Redundancy without fencing risks two writers, so name the mechanism. Cumulative with minimal. Binding checks: failover-source-code-boundary, failover-disaster-recovery-context.

Acceptance target: policy:infrastructure.disaster-recovery.failover:mid:failover-source-code-boundary+failover-disaster-recovery-context.
Declared predicates: failover-source-code-boundary: `failover_trigger` is nonempty (a string or array); failover-disaster-recovery-context: `fencing_strategy` is nonempty (a string or array).
