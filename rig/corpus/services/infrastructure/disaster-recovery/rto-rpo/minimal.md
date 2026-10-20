# infrastructure.disaster-recovery.rto-rpo — minimal

State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for rto rpo. The minimal boundary for rto rpo checks rto_minutes (minimum 30): rto minutes must meet the configured minimum of 30. Binding checks: rto-rpo-source-code-boundary.

Start from a repository-owned command or existing native check that can observe disaster-recovery.rto-rpo; bind it to the input named in `rig-services/infrastructure.disaster-recovery.rto-rpo.json` and preserve the check's failure status. When adopting this in an existing repository, connect rto rpo to the command that inspects rto_minutes and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside disaster-recovery.rto-rpo as a failure.

Acceptance target: policy:infrastructure.disaster-recovery.rto-rpo:minimal:rto-rpo-source-code-boundary.

Declared predicates: rto-rpo-source-code-boundary: `rto_minutes` is numeric and at least 30.
