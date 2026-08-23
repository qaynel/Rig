# infrastructure.disaster-recovery.failover - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

failover is the sole catalogue owner of `disaster-recovery.failover`. It must not absorb other disaster recovery concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `disaster-recovery.failover`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.disaster-recovery.failover:policy-boundary. Given source-code is present and disaster-recovery.failover is selected, pass only when the repository binding evaluates disaster-recovery.failover and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern.
