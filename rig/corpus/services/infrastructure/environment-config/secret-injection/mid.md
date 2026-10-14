# infrastructure.environment-config.secret-injection — mid

Mid adds repository context for secret injection; it does not widen ownership beyond runtime-secret-injection, secret-injection-wiring. The context signals are delivery_mechanism.

Read the existing repository's secret injection convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in environment-config under their own verdicts.

Acceptance target: fixture:infrastructure.environment-config.secret-injection:repository-context. Given runtime-secret-injection has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent environment config concern; fail when the result infers local convention without an inspectable source.
