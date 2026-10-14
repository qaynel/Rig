# infrastructure.disaster-recovery.rto-rpo — minimal

Minimal establishes a non-vacuous policy boundary for rto rpo. It checks rto_minutes (minimum 30): rto minutes must meet the configured minimum of 30..

Start from a repository-owned command or existing native check that can observe disaster-recovery.rto-rpo; bind it to the input named in `rig-services/infrastructure.disaster-recovery.rto-rpo.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside disaster-recovery.rto-rpo is a failure.

Acceptance target: fixture:infrastructure.disaster-recovery.rto-rpo:policy-boundary. Given source-code is present and disaster-recovery.rto-rpo is selected, pass only when the repository binding evaluates disaster-recovery.rto-rpo and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern. A passing policy check does not establish runtime behavior.
