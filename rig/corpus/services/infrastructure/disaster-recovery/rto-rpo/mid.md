# infrastructure.disaster-recovery.rto-rpo — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for rto rpo; it does not widen ownership beyond disaster-recovery.rto-rpo. For rto rpo, inspect these context signals: rpo_minutes. Binding checks: rto-rpo-disaster-recovery-context.

Trace the verdict to the existing repository's rto rpo convention, then name the source path or command that establishes it. For rto rpo, inspect the repository's actual spec, source, test, or configuration for rpo_minutes; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring disaster-recovery services outside the rto rpo decision for disaster-recovery.rto-rpo.

Acceptance target: fixture:infrastructure.disaster-recovery.rto-rpo:repository-context. Given disaster-recovery.rto-rpo has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent disaster recovery concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.
minimal: rto minutes — 30.
mid: rpo minutes — 5.
maximal: claim targets without exercise — false.
