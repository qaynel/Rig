# development.code-creation.feature-implementation — minimal

Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for feature implementation. The minimal boundary for feature implementation checks acceptance_cases (nonempty): acceptance cases must name the concrete repository contract. Binding checks: feature-implementation-source-code-boundary.

Start from a repository-owned command or existing native check that can observe code-creation.feature-implementation; bind it to the input named in `rig-services/development.code-creation.feature-implementation.json` and preserve the check's failure status. When adopting this in an existing repository, connect feature implementation to the command that inspects acceptance_cases and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-creation.feature-implementation as a failure.

Acceptance target: policy:development.code-creation.feature-implementation:minimal:feature-implementation-source-code-boundary.

Declared predicates: feature-implementation-source-code-boundary: `acceptance_cases` is nonempty (a string or array).
