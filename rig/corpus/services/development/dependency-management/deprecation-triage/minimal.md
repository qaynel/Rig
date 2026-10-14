# development.dependency-management.deprecation-triage — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for deprecation triage. It checks deprecated_apis (nonempty): deprecated apis must name the concrete repository contract.. Binding checks: deprecation-triage-source-code-boundary.

Start from a repository-owned command or existing native check that can observe dependency-management.deprecation-triage; bind it to the input named in `rig-services/development.dependency-management.deprecation-triage.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside dependency-management.deprecation-triage is a failure.

Acceptance target: fixture:development.dependency-management.deprecation-triage:policy-boundary. Given source-code is present and dependency-management.deprecation-triage is selected, pass only when the repository binding evaluates dependency-management.deprecation-triage and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent dependency management concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Owned scope: `dependency-management.deprecation-triage`.

Offer: Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Input: `rig-services/development.dependency-management.deprecation-triage.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Select an approved repository-owned command to verify that behavior.

minimal: deprecated apis — ["legacyClient"].

mid: replacement owners — ["platform"].

maximal: ignore removal deadline — false.
