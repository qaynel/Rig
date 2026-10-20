# infrastructure.disaster-recovery.rto-rpo — identity

Policy grade: rto rpo owns disaster-recovery.rto-rpo. State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Keep neighboring disaster-recovery services outside the rto rpo decision for disaster-recovery.rto-rpo. Ground the decision in the configured input at `rig-services/infrastructure.disaster-recovery.rto-rpo.json`; malformed input is still attributed to that path.

Disposition: executable. Use the limit: rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Choose a repository-owned check that observes rto rpo from rig-services/infrastructure.disaster-recovery.rto-rpo.json.

Acceptance target: policy:infrastructure.disaster-recovery.rto-rpo:minimal:rto-rpo-source-code-boundary.

Declared predicates: rto-rpo-source-code-boundary: `rto_minutes` is numeric and at least 30.
