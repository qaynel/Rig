# infrastructure.disaster-recovery.rto-rpo — behavior-oracle slice

Policy grade slice. This slice bounds rto rpo to disaster-recovery.rto-rpo. It uses `rto-rpo-slice-behavior-oracle` and checks rto_minutes (minimum 30): rto minutes must meet the configured minimum of 30..

For rto rpo, choose a repository example that satisfies rto_minutes at the behavior-oracle floor, plus a failure where rto minutes must meet the configured minimum of 30. is false. For rto rpo, wire `behavior-oracle` to `rig-services/infrastructure.disaster-recovery.rto-rpo.json` and keep its verdict on rto_minutes; missing evidence is a named gap, with ceiling rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Choose a repository-owned check that observes rto rpo from rig-services/infrastructure.disaster-recovery.rto-rpo.json..

Service-specific evidence cues:
Offer: State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.
minimal: rto minutes — 30.
mid: rpo minutes — 5.
maximal: claim targets without exercise — false.
