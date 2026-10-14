# infrastructure.disaster-recovery.failover — minimal

Minimal establishes a non-vacuous policy boundary for failover. It checks failover_trigger (nonempty): failover trigger must name the concrete repository contract..

Start from a repository-owned command or existing native check that can observe disaster-recovery.failover; bind it to the input named in `rig-services/infrastructure.disaster-recovery.failover.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside disaster-recovery.failover is a failure.

Acceptance target: fixture:infrastructure.disaster-recovery.failover:policy-boundary. Given source-code is present and disaster-recovery.failover is selected, pass only when the repository binding evaluates disaster-recovery.failover and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern. A passing policy check does not establish runtime behavior.
