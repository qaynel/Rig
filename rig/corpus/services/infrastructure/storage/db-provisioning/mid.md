# infrastructure.storage.db-provisioning — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for db provisioning; it does not widen ownership beyond storage.db-provisioning. For db provisioning, inspect these context signals: access_scope. Binding checks: db-provisioning-storage-context.

Start from the existing repository's db provisioning convention, then name the source path or command that establishes it. For db provisioning, inspect the repository's actual spec, source, test, or configuration for access_scope; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring storage services outside the db provisioning decision for storage.db-provisioning.

Acceptance target: fixture:infrastructure.storage.db-provisioning:repository-context. Given storage.db-provisioning has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent storage concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.
minimal: database version — "16".
mid: access scope — "private-network".
maximal: public database endpoint — false.
