# infrastructure.storage.db-provisioning — mid

Mid adds repository context for db provisioning; it does not widen ownership beyond storage.db-provisioning. The context signals are access_scope.

Start from the existing repository's db provisioning convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in storage under their own verdicts.

Acceptance target: fixture:infrastructure.storage.db-provisioning:repository-context. Given storage.db-provisioning has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent storage concern; fail when the result infers local convention without an inspectable source.
