# testing.mutation.execution-orchestrator — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for execution orchestrator. It checks worker_limit (minimum 2): worker limit must meet the configured minimum of 2.. Binding checks: execution-orchestrator-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe mutation.execution-orchestrator; bind it to the input named in `rig-services/testing.mutation.execution-orchestrator.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.execution-orchestrator is a failure.

Acceptance target: fixture:testing.mutation.execution-orchestrator:policy-boundary. Given source-code is present and mutation.execution-orchestrator is selected, pass only when the repository binding evaluates mutation.execution-orchestrator and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Owned scope: `mutation.execution-orchestrator`.

Offer: Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Input: `rig-services/testing.mutation.execution-orchestrator.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Select an approved repository-owned command to verify that behavior.

minimal: worker limit — 2.

mid: per mutant timeout ms — 1000.

maximal: share mutable worktrees — false.
