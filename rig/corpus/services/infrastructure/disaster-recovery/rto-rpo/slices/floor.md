# infrastructure.disaster-recovery.rto-rpo — floor and mutation-floor slice

Policy grade slice. This slice bounds rto rpo to disaster-recovery.rto-rpo. It uses `rto-rpo-slice-floor` and checks rto_minutes (minimum 30): rto minutes must meet the configured minimum of 30..

Read a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.disaster-recovery.rto-rpo.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Owned scope: `disaster-recovery.rto-rpo`.

Offer: State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Input: `rig-services/infrastructure.disaster-recovery.rto-rpo.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Select an approved repository-owned command to verify that behavior.

minimal: rto minutes — 30.

mid: rpo minutes — 5.

maximal: claim targets without exercise — false.
