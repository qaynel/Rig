# infrastructure.disaster-recovery.rto-rpo — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for rto rpo. It checks rto_minutes (minimum 30): rto minutes must meet the configured minimum of 30.. Binding checks: rto-rpo-source-code-boundary.

Start from a repository-owned command or existing native check that can observe disaster-recovery.rto-rpo; bind it to the input named in `rig-services/infrastructure.disaster-recovery.rto-rpo.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside disaster-recovery.rto-rpo is a failure.

Acceptance target: fixture:infrastructure.disaster-recovery.rto-rpo:policy-boundary. Given source-code is present and disaster-recovery.rto-rpo is selected, pass only when the repository binding evaluates disaster-recovery.rto-rpo and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Owned scope: `disaster-recovery.rto-rpo`.

Offer: State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Input: `rig-services/infrastructure.disaster-recovery.rto-rpo.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Select an approved repository-owned command to verify that behavior.

minimal: rto minutes — 30.

mid: rpo minutes — 5.

maximal: claim targets without exercise — false.
