# testing.mutation.execution-orchestrator — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for execution orchestrator. The minimal boundary for execution orchestrator checks worker_limit (minimum 2): worker limit must meet the configured minimum of 2.. Binding checks: execution-orchestrator-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe mutation.execution-orchestrator; bind it to the input named in `rig-services/testing.mutation.execution-orchestrator.json` and preserve the check's failure status. When adopting this in an existing repository, connect execution orchestrator to the command that inspects worker_limit and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside mutation.execution-orchestrator as a failure.

Acceptance target: fixture:testing.mutation.execution-orchestrator:policy-boundary. Given source-code is present and mutation.execution-orchestrator is selected, pass only when the repository binding evaluates mutation.execution-orchestrator and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. The ceiling is execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Choose a repository-owned check that observes execution orchestrator from rig-services/testing.mutation.execution-orchestrator.json..

Service-specific evidence cues:
Offer: Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.
minimal: worker limit — 2.
mid: per mutant timeout ms — 1000.
maximal: share mutable worktrees — false.
