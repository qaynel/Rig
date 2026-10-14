# infrastructure.disaster-recovery.dr-runbooks — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for dr runbooks. The minimal boundary for dr runbooks checks recovery_steps (nonempty): recovery steps must name the concrete repository contract.. Binding checks: dr-runbooks-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe disaster-recovery.dr-runbooks; bind it to the input named in `rig-services/infrastructure.disaster-recovery.dr-runbooks.json` and preserve the check's failure status. When adopting this in an existing repository, connect dr runbooks to the command that inspects recovery_steps and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside disaster-recovery.dr-runbooks as a failure.

Acceptance target: fixture:infrastructure.disaster-recovery.dr-runbooks:policy-boundary. Given source-code is present and disaster-recovery.dr-runbooks is selected, pass only when the repository binding evaluates disaster-recovery.dr-runbooks and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern. The ceiling is dr runbooks configuration validation only; declared policy does not prove running dr runbooks behavior. Choose a repository-owned check that observes dr runbooks from rig-services/infrastructure.disaster-recovery.dr-runbooks.json..

Service-specific evidence cues:
Offer: A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.
minimal: recovery steps — ["restore database","verify application"].
mid: exercise schedule — "quarterly".
maximal: runbook without owner — false.
