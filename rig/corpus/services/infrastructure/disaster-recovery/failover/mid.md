# infrastructure.disaster-recovery.failover — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for failover; it does not widen ownership beyond disaster-recovery.failover. For failover, inspect these context signals: fencing_strategy. Binding checks: failover-disaster-recovery-context.

Trace the verdict to the existing repository's failover convention, then name the source path or command that establishes it. For failover, inspect the repository's actual spec, source, test, or configuration for fencing_strategy; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring disaster-recovery services outside the failover decision for disaster-recovery.failover.

Acceptance target: fixture:infrastructure.disaster-recovery.failover:repository-context. Given disaster-recovery.failover has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent disaster recovery concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.
minimal: failover trigger — "primary health unavailable".
mid: fencing strategy — "single-writer-lease".
maximal: allow split brain — false.
