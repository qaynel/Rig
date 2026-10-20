# testing.mutation.execution-orchestrator — maximal

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: execution-orchestrator-source-code-boundary, execution-orchestrator-mutation-context, execution-orchestrator-evidence-receipt.

Keep `share_mutable_worktrees` equal to false. The isolation flag must remain false for shared mutable worktrees; configuration alone does not prove each worker got a clean tree.

Maximal here adds a configuration guard, not an evidence receipt or a demonstrated mutation outcome. execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Select an approved repository-owned command to verify that behavior.

Evidence-replay target (not established by this policy check): policy:testing.mutation.execution-orchestrator:maximal:execution-orchestrator-source-code-boundary+execution-orchestrator-mutation-context+execution-orchestrator-evidence-receipt.

Check: `execution-orchestrator-evidence-receipt`.
