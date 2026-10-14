# infrastructure.disaster-recovery.dr-runbooks — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for dr runbooks; it does not widen ownership beyond disaster-recovery.dr-runbooks. For dr runbooks, inspect these context signals: exercise_schedule. Binding checks: dr-runbooks-disaster-recovery-context.

Inspect the existing repository's dr runbooks convention, then name the source path or command that establishes it. For dr runbooks, inspect the repository's actual spec, source, test, or configuration for exercise_schedule; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring disaster-recovery services outside the dr runbooks decision for disaster-recovery.dr-runbooks.

Acceptance target: fixture:infrastructure.disaster-recovery.dr-runbooks:repository-context. Given disaster-recovery.dr-runbooks has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent disaster recovery concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.
minimal: recovery steps — ["restore database","verify application"].
mid: exercise schedule — "quarterly".
maximal: runbook without owner — false.
