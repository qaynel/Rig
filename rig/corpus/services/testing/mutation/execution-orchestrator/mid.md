# testing.mutation.execution-orchestrator — mid

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: execution-orchestrator-source-code-boundary, execution-orchestrator-mutation-context.

Set `per_mutant_timeout_ms` to at least 1000. Set the timeout from the repository’s normal test duration and reserve enough time to classify timeouts as inconclusive.

This remains configuration review. A value in `rig-services/testing.mutation.execution-orchestrator.json` does not prove the command was run, that its output was correct, or that neighboring mutation stages were covered.

Repository-context target (not established by this policy check): policy:testing.mutation.execution-orchestrator:mid:execution-orchestrator-source-code-boundary+execution-orchestrator-mutation-context.

Check: `execution-orchestrator-mutation-context`.
