# development.architecture.tech-debt — mid

Mid adds repository context for tech debt; it does not widen ownership beyond architecture.tech-debt. The context signals are owners.

Read the existing repository's tech debt convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in architecture under their own verdicts.

Acceptance target: fixture:development.architecture.tech-debt:repository-context. Given architecture.tech-debt has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent architecture concern; fail when the result infers local convention without an inspectable source.
