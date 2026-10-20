# development.dependency-management.deprecation-triage — minimal

Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Policy grade, minimal: List each deprecated API in use by name and version. A missing list means a disappearing dependency goes unnoticed, so enumerate them. Binding checks: deprecation-triage-source-code-boundary.

Acceptance target: policy:development.dependency-management.deprecation-triage:minimal:deprecation-triage-source-code-boundary.
Declared predicates: deprecation-triage-source-code-boundary: `deprecated_apis` is nonempty (a string or array).
