# infrastructure.disaster-recovery.dr-runbooks — identity

Policy grade: dr runbooks owns disaster-recovery.dr-runbooks. A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Keep neighboring disaster-recovery services outside the dr runbooks decision for disaster-recovery.dr-runbooks. Start from the configured input at `rig-services/infrastructure.disaster-recovery.dr-runbooks.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: dr runbooks configuration validation only; declared policy does not prove running dr runbooks behavior. Choose a repository-owned check that observes dr runbooks from rig-services/infrastructure.disaster-recovery.dr-runbooks.json.

Acceptance target: policy:infrastructure.disaster-recovery.dr-runbooks:minimal:dr-runbooks-source-code-boundary.

Declared predicates: dr-runbooks-source-code-boundary: `recovery_steps` is nonempty (a string or array).
