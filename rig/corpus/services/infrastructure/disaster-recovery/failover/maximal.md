# infrastructure.disaster-recovery.failover — maximal

Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: failover-source-code-boundary, failover-disaster-recovery-context, failover-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:infrastructure.disaster-recovery.failover:maximal:failover-source-code-boundary+failover-disaster-recovery-context+failover-evidence-receipt.

Declared predicates: failover-source-code-boundary: `failover_trigger` is nonempty (a string or array); failover-disaster-recovery-context: `fencing_strategy` is nonempty (a string or array); failover-evidence-receipt: `allow_split_brain` equals false.
