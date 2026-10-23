# infrastructure.disaster-recovery.rto-rpo — mid

State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Policy grade, mid: State the recovery point objective in minutes, at least 5. It bounds data loss, so choose a value backed by backup frequency. Cumulative with minimal. Binding checks: rto-rpo-source-code-boundary, rto-rpo-disaster-recovery-context.

Acceptance target: policy:infrastructure.disaster-recovery.rto-rpo:mid:rto-rpo-source-code-boundary+rto-rpo-disaster-recovery-context.
Declared predicates: rto-rpo-source-code-boundary: `rto_minutes` is numeric and at least 30; rto-rpo-disaster-recovery-context: `rpo_minutes` is numeric and at least 5.
