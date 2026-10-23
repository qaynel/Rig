# infrastructure.disaster-recovery.rto-rpo — behavior-oracle slice

State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Policy grade slice `rto-rpo-slice-behavior-oracle`: State the recovery time objective in minutes, at least 30. A figure below what the system can meet is a wish, so choose a measurable limit. Despite its name this slice is not a behavior oracle: it confirms recovery-time and data-loss objectives and the untested-claim flag are declared; it does not measure a real recovery.
