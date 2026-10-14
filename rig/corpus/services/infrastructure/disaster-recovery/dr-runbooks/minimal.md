# infrastructure.disaster-recovery.dr-runbooks — minimal

Minimal establishes a non-vacuous policy boundary for dr runbooks. It checks recovery_steps (nonempty): recovery steps must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe disaster-recovery.dr-runbooks; bind it to the input named in `rig-services/infrastructure.disaster-recovery.dr-runbooks.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside disaster-recovery.dr-runbooks is a failure.

Acceptance target: fixture:infrastructure.disaster-recovery.dr-runbooks:policy-boundary. Given source-code is present and disaster-recovery.dr-runbooks is selected, pass only when the repository binding evaluates disaster-recovery.dr-runbooks and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern. A passing policy check does not establish runtime behavior.
