# testing.integration.external-service — mid

Mid adds repository context for external service; it does not widen ownership beyond integration.external-service. The context signals are failure_cases.

Inspect the existing repository's external service convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in integration under their own verdicts.

Acceptance target: fixture:testing.integration.external-service:repository-context. Given integration.external-service has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent integration concern; fail when the result infers local convention without an inspectable source.
