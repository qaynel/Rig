# infrastructure.provisioning.environment-parity — mid

Mid adds repository context for environment parity; it does not widen ownership beyond provisioning.environment-parity. The context signals are intentional_differences.

Anchor the review on the existing repository's environment parity convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in provisioning under their own verdicts.

Acceptance target: fixture:infrastructure.provisioning.environment-parity:repository-context. Given provisioning.environment-parity has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent provisioning concern; fail when the result infers local convention without an inspectable source.
