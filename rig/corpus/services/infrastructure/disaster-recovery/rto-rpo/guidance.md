# rto-rpo

State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Owned scope: `disaster-recovery.rto-rpo`. Input: `rig-services/infrastructure.disaster-recovery.rto-rpo.json`.

Coverage ceiling: Configuration validation only, so it confirms recovery-time and data-loss objectives and the untested-claim flag are declared; it does not measure a real recovery.

minimal: rto minutes — 30. State the recovery time objective in minutes, at least 30. A figure below what the system can meet is a wish, so choose a measurable limit.

mid: rpo minutes — 5. State the recovery point objective in minutes, at least 5. It bounds data loss, so choose a value backed by backup frequency.

maximal: claim targets without exercise — false. Set claiming targets without an exercise to false. A target is assurance only after an actual recovery measures it, so exercise before you claim.
