# infrastructure.disaster-recovery.rto-rpo — mid

State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: rto-rpo-source-code-boundary, rto-rpo-disaster-recovery-context.

Trace the verdict to the existing repository's rto rpo convention, then name the source path or command that establishes it. For rto rpo, inspect the repository's actual spec, source, test, or configuration for rpo_minutes; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring disaster-recovery services outside the rto rpo decision for disaster-recovery.rto-rpo.

Acceptance target: policy:infrastructure.disaster-recovery.rto-rpo:mid:rto-rpo-source-code-boundary+rto-rpo-disaster-recovery-context.

Declared predicates: rto-rpo-source-code-boundary: `rto_minutes` is numeric and at least 30; rto-rpo-disaster-recovery-context: `rpo_minutes` is numeric and at least 5.
