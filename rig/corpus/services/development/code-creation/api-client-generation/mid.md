# development.code-creation.api-client-generation — mid

Mid adds repository context for api client generation; it does not widen ownership beyond code-creation.api-client-generation. The context signals are compatibility_version.

Inspect the existing repository's api client generation convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in code-creation under their own verdicts.

Acceptance target: fixture:development.code-creation.api-client-generation:repository-context. Given code-creation.api-client-generation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code creation concern; fail when the result infers local convention without an inspectable source.
