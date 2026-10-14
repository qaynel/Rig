# testing.integration.internal-contract — mid

Mid adds repository context for internal contract; it does not widen ownership beyond integration.internal-contract. The context signals are consumer_versions.

Read the existing repository's internal contract convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in integration under their own verdicts.

Acceptance target: fixture:testing.integration.internal-contract:repository-context. Given integration.internal-contract has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent integration concern; fail when the result infers local convention without an inspectable source.
