# testing.mutation.execution-orchestrator — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for execution orchestrator; it does not widen ownership beyond mutation.execution-orchestrator. For execution orchestrator, inspect these context signals: per_mutant_timeout_ms. Binding checks: execution-orchestrator-mutation-context.

Inspect the existing repository's execution orchestrator convention, then name the source path or command that establishes it. For execution orchestrator, inspect the repository's actual spec, source, test, or configuration for per_mutant_timeout_ms; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring mutation services outside the execution orchestrator decision for mutation.execution-orchestrator.

Acceptance target: fixture:testing.mutation.execution-orchestrator:repository-context. Given mutation.execution-orchestrator has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.
minimal: worker limit — 2.
mid: per mutant timeout ms — 1000.
maximal: share mutable worktrees — false.
