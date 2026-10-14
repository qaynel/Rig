# infrastructure.disaster-recovery.rto-rpo — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for rto rpo. The minimal boundary for rto rpo checks rto_minutes (minimum 30): rto minutes must meet the configured minimum of 30.. Binding checks: rto-rpo-source-code-boundary.

Start from a repository-owned command or existing native check that can observe disaster-recovery.rto-rpo; bind it to the input named in `rig-services/infrastructure.disaster-recovery.rto-rpo.json` and preserve the check's failure status. When adopting this in an existing repository, connect rto rpo to the command that inspects rto_minutes and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside disaster-recovery.rto-rpo as a failure.

Acceptance target: fixture:infrastructure.disaster-recovery.rto-rpo:policy-boundary. Given source-code is present and disaster-recovery.rto-rpo is selected, pass only when the repository binding evaluates disaster-recovery.rto-rpo and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern. The ceiling is rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Choose a repository-owned check that observes rto rpo from rig-services/infrastructure.disaster-recovery.rto-rpo.json..

Service-specific evidence cues:
Offer: State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.
minimal: rto minutes — 30.
mid: rpo minutes — 5.
maximal: claim targets without exercise — false.
