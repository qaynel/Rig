# infrastructure.disaster-recovery.rto-rpo — maximal

State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Policy grade, maximal: Set claiming targets without an exercise to false. A target is assurance only after an actual recovery measures it, so exercise before you claim. Cumulative with minimal and mid. Binding checks: rto-rpo-source-code-boundary, rto-rpo-disaster-recovery-context, rto-rpo-evidence-receipt.

Acceptance target: policy:infrastructure.disaster-recovery.rto-rpo:maximal:rto-rpo-source-code-boundary+rto-rpo-disaster-recovery-context+rto-rpo-evidence-receipt.
Declared predicates: rto-rpo-source-code-boundary: `rto_minutes` is numeric and at least 30; rto-rpo-disaster-recovery-context: `rpo_minutes` is numeric and at least 5; rto-rpo-evidence-receipt: `claim_targets_without_exercise` equals false.
