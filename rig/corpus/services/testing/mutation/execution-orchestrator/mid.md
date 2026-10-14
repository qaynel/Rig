# testing.mutation.execution-orchestrator — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for execution orchestrator; it does not widen ownership beyond mutation.execution-orchestrator. The context signals are per_mutant_timeout_ms. Binding checks: execution-orchestrator-mutation-context.

Inspect the existing repository's execution orchestrator convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.execution-orchestrator:repository-context. Given mutation.execution-orchestrator has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Owned scope: `mutation.execution-orchestrator`.

Offer: Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Input: `rig-services/testing.mutation.execution-orchestrator.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Select an approved repository-owned command to verify that behavior.

minimal: worker limit — 2.

mid: per mutant timeout ms — 1000.

maximal: share mutable worktrees — false.
