# testing.mutation.execution-orchestrator — identity

execution orchestrator owns mutation.execution-orchestrator. Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Keep sibling services in mutation under their own verdicts. Start from the configured input at `rig-services/testing.mutation.execution-orchestrator.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.execution-orchestrator:policy-boundary. Given source-code is present and mutation.execution-orchestrator is selected, pass only when the repository binding evaluates mutation.execution-orchestrator and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.
