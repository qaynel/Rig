# development.dependency-management.upgrades-migration — mid

Mid adds repository context for upgrades migration; it does not widen ownership beyond dependency-management.upgrades-migration. The context signals are migration_steps.

Start from the existing repository's upgrades migration convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in dependency-management under their own verdicts.

Acceptance target: fixture:development.dependency-management.upgrades-migration:repository-context. Given dependency-management.upgrades-migration has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent dependency management concern; fail when the result infers local convention without an inspectable source.
