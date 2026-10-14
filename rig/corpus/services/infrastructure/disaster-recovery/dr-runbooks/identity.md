# infrastructure.disaster-recovery.dr-runbooks — identity

Policy grade: dr runbooks owns disaster-recovery.dr-runbooks. A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Keep neighboring disaster-recovery services outside the dr runbooks decision for disaster-recovery.dr-runbooks. Start from the configured input at `rig-services/infrastructure.disaster-recovery.dr-runbooks.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: dr runbooks configuration validation only; declared policy does not prove running dr runbooks behavior. Choose a repository-owned check that observes dr runbooks from rig-services/infrastructure.disaster-recovery.dr-runbooks.json.

Acceptance target: fixture:infrastructure.disaster-recovery.dr-runbooks:policy-boundary. Given source-code is present and disaster-recovery.dr-runbooks is selected, pass only when the repository binding evaluates disaster-recovery.dr-runbooks and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern.

Service-specific evidence cues:
Offer: A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.
minimal: recovery steps — ["restore database","verify application"].
mid: exercise schedule — "quarterly".
maximal: runbook without owner — false.
