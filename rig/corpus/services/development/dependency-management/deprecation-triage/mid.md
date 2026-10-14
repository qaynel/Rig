# development.dependency-management.deprecation-triage — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for deprecation triage; it does not widen ownership beyond dependency-management.deprecation-triage. For deprecation triage, inspect these context signals: replacement_owners. Binding checks: deprecation-triage-dependency-management-context.

Trace the verdict to the existing repository's deprecation triage convention, then name the source path or command that establishes it. For deprecation triage, inspect the repository's actual spec, source, test, or configuration for replacement_owners; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring dependency-management services outside the deprecation triage decision for dependency-management.deprecation-triage.

Acceptance target: fixture:development.dependency-management.deprecation-triage:repository-context. Given dependency-management.deprecation-triage has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent dependency management concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.
minimal: deprecated apis — ["legacyClient"].
mid: replacement owners — ["platform"].
maximal: ignore removal deadline — false.
