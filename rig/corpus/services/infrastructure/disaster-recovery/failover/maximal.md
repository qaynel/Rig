# infrastructure.disaster-recovery.failover — maximal

Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Policy grade, maximal: Set allowing split-brain to false. Two writers corrupt data, so require fencing to complete before promotion. Cumulative with minimal and mid. Binding checks: failover-source-code-boundary, failover-disaster-recovery-context, failover-evidence-receipt.

Acceptance target: policy:infrastructure.disaster-recovery.failover:maximal:failover-source-code-boundary+failover-disaster-recovery-context+failover-evidence-receipt.
Declared predicates: failover-source-code-boundary: `failover_trigger` is nonempty (a string or array); failover-disaster-recovery-context: `fencing_strategy` is nonempty (a string or array); failover-evidence-receipt: `allow_split_brain` equals false.
