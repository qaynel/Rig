# infrastructure.cicd.pipeline-definition — mid

Mid adds repository context for pipeline definition; it does not widen ownership beyond cicd.pipeline-definition. The context signals are required_checks.

Read the existing repository's pipeline definition convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in cicd under their own verdicts.

Acceptance target: fixture:infrastructure.cicd.pipeline-definition:repository-context. Given cicd.pipeline-definition has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cicd concern; fail when the result infers local convention without an inspectable source.
