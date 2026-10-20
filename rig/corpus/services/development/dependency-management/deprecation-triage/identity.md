# development.dependency-management.deprecation-triage — identity

Policy grade: deprecation triage owns dependency-management.deprecation-triage. Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Keep neighboring dependency-management services outside the deprecation triage decision for dependency-management.deprecation-triage. Ground the decision in the configured input at `rig-services/development.dependency-management.deprecation-triage.json`; malformed input is still attributed to that path.

Disposition: executable. Use the limit: deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Choose a repository-owned check that observes deprecation triage from rig-services/development.dependency-management.deprecation-triage.json.

Acceptance target: policy:development.dependency-management.deprecation-triage:minimal:deprecation-triage-source-code-boundary.

Declared predicates: deprecation-triage-source-code-boundary: `deprecated_apis` is nonempty (a string or array).
