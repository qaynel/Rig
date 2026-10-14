# development.dependency-management.deprecation-triage — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for deprecation triage. The minimal boundary for deprecation triage checks deprecated_apis (nonempty): deprecated apis must name the concrete repository contract.. Binding checks: deprecation-triage-source-code-boundary.

Start from a repository-owned command or existing native check that can observe dependency-management.deprecation-triage; bind it to the input named in `rig-services/development.dependency-management.deprecation-triage.json` and preserve the check's failure status. When adopting this in an existing repository, connect deprecation triage to the command that inspects deprecated_apis and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside dependency-management.deprecation-triage as a failure.

Acceptance target: fixture:development.dependency-management.deprecation-triage:policy-boundary. Given source-code is present and dependency-management.deprecation-triage is selected, pass only when the repository binding evaluates dependency-management.deprecation-triage and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent dependency management concern. The ceiling is deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Choose a repository-owned check that observes deprecation triage from rig-services/development.dependency-management.deprecation-triage.json..

Service-specific evidence cues:
Offer: Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.
minimal: deprecated apis — ["legacyClient"].
mid: replacement owners — ["platform"].
maximal: ignore removal deadline — false.
