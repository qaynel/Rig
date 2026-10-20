# development.dependency-management.deprecation-triage — identity

Policy grade: deprecation-triage owns dependency-management.deprecation-triage. Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Input: `rig-services/development.dependency-management.deprecation-triage.json`. Configuration validation only, so it confirms deprecated APIs, replacement owners and the deadline-handling flag are declared; it does not show the migration is done.

Disposition: executable.
Acceptance target: policy:development.dependency-management.deprecation-triage:minimal:deprecation-triage-source-code-boundary.
Declared predicates: deprecation-triage-source-code-boundary: `deprecated_apis` is nonempty (a string or array).
