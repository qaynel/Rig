# testing.mutation.execution-orchestrator — maximal

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Policy grade, maximal: Set sharing mutable worktrees to false. A shared tree lets one mutant contaminate another's verdict, so isolate each. Cumulative with minimal and mid. Binding checks: execution-orchestrator-source-code-boundary, execution-orchestrator-mutation-context, execution-orchestrator-evidence-receipt.
