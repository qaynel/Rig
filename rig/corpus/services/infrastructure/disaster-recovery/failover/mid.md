# infrastructure.disaster-recovery.failover — mid

Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: failover-source-code-boundary, failover-disaster-recovery-context.

Trace the verdict to the existing repository's failover convention, then name the source path or command that establishes it. For failover, inspect the repository's actual spec, source, test, or configuration for fencing_strategy; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring disaster-recovery services outside the failover decision for disaster-recovery.failover.

Acceptance target: policy:infrastructure.disaster-recovery.failover:mid:failover-source-code-boundary+failover-disaster-recovery-context.

Declared predicates: failover-source-code-boundary: `failover_trigger` is nonempty (a string or array); failover-disaster-recovery-context: `fencing_strategy` is nonempty (a string or array).
