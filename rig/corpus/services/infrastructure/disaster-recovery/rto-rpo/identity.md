# infrastructure.disaster-recovery.rto-rpo — identity

Policy grade: rto-rpo owns disaster-recovery.rto-rpo. State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Input: `rig-services/infrastructure.disaster-recovery.rto-rpo.json`. Configuration validation only, so it confirms recovery-time and data-loss objectives and the untested-claim flag are declared; it does not measure a real recovery.

Disposition: executable.
Acceptance target: policy:infrastructure.disaster-recovery.rto-rpo:minimal:rto-rpo-source-code-boundary.
Declared predicates: rto-rpo-source-code-boundary: `rto_minutes` is numeric and at least 30.
