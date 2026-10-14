# testing.mutation.execution-orchestrator — mid

Mid adds repository context for execution orchestrator; it does not widen ownership beyond mutation.execution-orchestrator. The context signals are per_mutant_timeout_ms.

Inspect the existing repository's execution orchestrator convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.execution-orchestrator:repository-context. Given mutation.execution-orchestrator has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.
