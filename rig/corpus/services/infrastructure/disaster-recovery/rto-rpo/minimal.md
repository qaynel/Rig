# infrastructure.disaster-recovery.rto-rpo — minimal

State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Policy grade, minimal: State the recovery time objective in minutes, at least 30. A figure below what the system can meet is a wish, so choose a measurable limit. Binding checks: rto-rpo-source-code-boundary.

Acceptance target: policy:infrastructure.disaster-recovery.rto-rpo:minimal:rto-rpo-source-code-boundary.
Declared predicates: rto-rpo-source-code-boundary: `rto_minutes` is numeric and at least 30.
