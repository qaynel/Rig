# infrastructure.disaster-recovery.rto-rpo — floor and mutation-floor slice

State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Policy grade slice. This slice bounds rto rpo to disaster-recovery.rto-rpo. It uses `rto-rpo-slice-floor` and checks rto_minutes (minimum 30): rto minutes must meet the configured minimum of 30.