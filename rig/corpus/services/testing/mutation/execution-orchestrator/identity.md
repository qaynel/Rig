# testing.mutation.execution-orchestrator — identity

Policy grade: execution orchestrator owns mutation.execution-orchestrator. Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Keep neighboring mutation services outside the execution orchestrator decision for mutation.execution-orchestrator. Start from the configured input at `rig-services/testing.mutation.execution-orchestrator.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Choose a repository-owned check that observes execution orchestrator from rig-services/testing.mutation.execution-orchestrator.json.

Acceptance target: fixture:testing.mutation.execution-orchestrator:policy-boundary. Given source-code is present and mutation.execution-orchestrator is selected, pass only when the repository binding evaluates mutation.execution-orchestrator and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.

Service-specific evidence cues:
Offer: Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.
minimal: worker limit — 2.
mid: per mutant timeout ms — 1000.
maximal: share mutable worktrees — false.
