# infrastructure.disaster-recovery.dr-runbooks — property-floor slice

Policy grade slice. This slice bounds dr runbooks to disaster-recovery.dr-runbooks. It uses `dr-runbooks-slice-property-floor` and checks recovery_steps (nonempty): recovery steps must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.disaster-recovery.dr-runbooks.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than dr runbooks configuration validation only; declared policy does not prove running dr runbooks behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Owned scope: `disaster-recovery.dr-runbooks`.

Offer: A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Input: `rig-services/infrastructure.disaster-recovery.dr-runbooks.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dr runbooks configuration validation only; declared policy does not prove running dr runbooks behavior. Select an approved repository-owned command to verify that behavior.

minimal: recovery steps — ["restore database","verify application"].

mid: exercise schedule — "quarterly".

maximal: runbook without owner — false.
