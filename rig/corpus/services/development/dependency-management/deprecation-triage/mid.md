# development.dependency-management.deprecation-triage — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for deprecation triage; it does not widen ownership beyond dependency-management.deprecation-triage. The context signals are replacement_owners. Binding checks: deprecation-triage-dependency-management-context.

Trace the verdict to the existing repository's deprecation triage convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in dependency-management under their own verdicts.

Acceptance target: fixture:development.dependency-management.deprecation-triage:repository-context. Given dependency-management.deprecation-triage has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent dependency management concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Owned scope: `dependency-management.deprecation-triage`.

Offer: Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Input: `rig-services/development.dependency-management.deprecation-triage.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Select an approved repository-owned command to verify that behavior.

minimal: deprecated apis — ["legacyClient"].

mid: replacement owners — ["platform"].

maximal: ignore removal deadline — false.
