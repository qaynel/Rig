# infrastructure.cicd.deployment-strategy — mid

Mid adds repository context for deployment strategy; it does not widen ownership beyond cicd.deployment-strategy. The context signals are rollback_trigger.

Ground the decision in the existing repository's deployment strategy convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in cicd under their own verdicts.

Acceptance target: fixture:infrastructure.cicd.deployment-strategy:repository-context. Given cicd.deployment-strategy has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cicd concern; fail when the result infers local convention without an inspectable source.
