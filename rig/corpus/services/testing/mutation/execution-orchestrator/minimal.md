# testing.mutation.execution-orchestrator — minimal

Minimal establishes a non-vacuous policy boundary for execution orchestrator. It checks worker_limit (minimum 2): worker limit must meet the configured minimum of 2..

Anchor the review on a repository-owned command or existing native check that can observe mutation.execution-orchestrator; bind it to the input named in `rig-services/testing.mutation.execution-orchestrator.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.execution-orchestrator is a failure.

Acceptance target: fixture:testing.mutation.execution-orchestrator:policy-boundary. Given source-code is present and mutation.execution-orchestrator is selected, pass only when the repository binding evaluates mutation.execution-orchestrator and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.
