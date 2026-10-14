# infrastructure.disaster-recovery.rto-rpo — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for rto rpo; it does not widen ownership beyond disaster-recovery.rto-rpo. The context signals are rpo_minutes. Binding checks: rto-rpo-disaster-recovery-context.

Trace the verdict to the existing repository's rto rpo convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in disaster-recovery under their own verdicts.

Acceptance target: fixture:infrastructure.disaster-recovery.rto-rpo:repository-context. Given disaster-recovery.rto-rpo has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent disaster recovery concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Owned scope: `disaster-recovery.rto-rpo`.

Offer: State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Input: `rig-services/infrastructure.disaster-recovery.rto-rpo.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Select an approved repository-owned command to verify that behavior.

minimal: rto minutes — 30.

mid: rpo minutes — 5.

maximal: claim targets without exercise — false.
