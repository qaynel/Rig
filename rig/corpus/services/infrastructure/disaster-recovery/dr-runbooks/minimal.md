# infrastructure.disaster-recovery.dr-runbooks — minimal

A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for dr runbooks. The minimal boundary for dr runbooks checks recovery_steps (nonempty): recovery steps must name the concrete repository contract. Binding checks: dr-runbooks-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe disaster-recovery.dr-runbooks; bind it to the input named in `rig-services/infrastructure.disaster-recovery.dr-runbooks.json` and preserve the check's failure status. When adopting this in an existing repository, connect dr runbooks to the command that inspects recovery_steps and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside disaster-recovery.dr-runbooks as a failure.

Acceptance target: policy:infrastructure.disaster-recovery.dr-runbooks:minimal:dr-runbooks-source-code-boundary.

Declared predicates: dr-runbooks-source-code-boundary: `recovery_steps` is nonempty (a string or array).
