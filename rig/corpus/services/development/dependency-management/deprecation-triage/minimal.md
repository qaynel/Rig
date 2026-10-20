# development.dependency-management.deprecation-triage — minimal

Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for deprecation triage. The minimal boundary for deprecation triage checks deprecated_apis (nonempty): deprecated apis must name the concrete repository contract. Binding checks: deprecation-triage-source-code-boundary.

Start from a repository-owned command or existing native check that can observe dependency-management.deprecation-triage; bind it to the input named in `rig-services/development.dependency-management.deprecation-triage.json` and preserve the check's failure status. When adopting this in an existing repository, connect deprecation triage to the command that inspects deprecated_apis and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside dependency-management.deprecation-triage as a failure.

Acceptance target: policy:development.dependency-management.deprecation-triage:minimal:deprecation-triage-source-code-boundary.

Declared predicates: deprecation-triage-source-code-boundary: `deprecated_apis` is nonempty (a string or array).
