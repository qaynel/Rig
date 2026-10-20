# infrastructure.disaster-recovery.rto-rpo — maximal

State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: rto-rpo-source-code-boundary, rto-rpo-disaster-recovery-context, rto-rpo-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:infrastructure.disaster-recovery.rto-rpo:maximal:rto-rpo-source-code-boundary+rto-rpo-disaster-recovery-context+rto-rpo-evidence-receipt.

Declared predicates: rto-rpo-source-code-boundary: `rto_minutes` is numeric and at least 30; rto-rpo-disaster-recovery-context: `rpo_minutes` is numeric and at least 5; rto-rpo-evidence-receipt: `claim_targets_without_exercise` equals false.
