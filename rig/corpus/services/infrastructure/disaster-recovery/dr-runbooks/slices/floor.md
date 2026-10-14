# infrastructure.disaster-recovery.dr-runbooks — floor and mutation-floor slice

Policy grade slice. This slice bounds dr runbooks to disaster-recovery.dr-runbooks. It uses `dr-runbooks-slice-floor` and checks recovery_steps (nonempty): recovery steps must name the concrete repository contract..

For dr runbooks, choose a repository example that satisfies recovery_steps at the floor and mutation-floor floor, plus a failure where recovery steps must name the concrete repository contract. is false. For dr runbooks, wire `floor and mutation-floor` to `rig-services/infrastructure.disaster-recovery.dr-runbooks.json` and keep its verdict on recovery_steps; missing evidence is a named gap, with ceiling dr runbooks configuration validation only; declared policy does not prove running dr runbooks behavior. Choose a repository-owned check that observes dr runbooks from rig-services/infrastructure.disaster-recovery.dr-runbooks.json..

Service-specific evidence cues:
Offer: A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.
minimal: recovery steps — ["restore database","verify application"].
mid: exercise schedule — "quarterly".
maximal: runbook without owner — false.
