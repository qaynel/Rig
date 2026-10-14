# infrastructure.disaster-recovery.dr-runbooks — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for dr runbooks; it does not widen ownership beyond disaster-recovery.dr-runbooks. The context signals are exercise_schedule. Binding checks: dr-runbooks-disaster-recovery-context.

Inspect the existing repository's dr runbooks convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in disaster-recovery under their own verdicts.

Acceptance target: fixture:infrastructure.disaster-recovery.dr-runbooks:repository-context. Given disaster-recovery.dr-runbooks has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent disaster recovery concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Owned scope: `disaster-recovery.dr-runbooks`.

Offer: A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Input: `rig-services/infrastructure.disaster-recovery.dr-runbooks.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dr runbooks configuration validation only; declared policy does not prove running dr runbooks behavior. Select an approved repository-owned command to verify that behavior.

minimal: recovery steps — ["restore database","verify application"].

mid: exercise schedule — "quarterly".

maximal: runbook without owner — false.
