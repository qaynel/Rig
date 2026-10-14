# infrastructure.disaster-recovery.rto-rpo — identity

Policy grade: rto rpo owns disaster-recovery.rto-rpo. State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Keep sibling services in disaster-recovery under their own verdicts. Ground the decision in the configured input at `rig-services/infrastructure.disaster-recovery.rto-rpo.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.disaster-recovery.rto-rpo:policy-boundary. Given source-code is present and disaster-recovery.rto-rpo is selected, pass only when the repository binding evaluates disaster-recovery.rto-rpo and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern.

Service-specific evidence cues:
State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Owned scope: `disaster-recovery.rto-rpo`.

Offer: State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Input: `rig-services/infrastructure.disaster-recovery.rto-rpo.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Select an approved repository-owned command to verify that behavior.

minimal: rto minutes — 30.

mid: rpo minutes — 5.

maximal: claim targets without exercise — false.
