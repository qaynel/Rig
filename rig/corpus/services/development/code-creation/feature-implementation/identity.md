# development.code-creation.feature-implementation — identity

Policy grade: feature implementation owns code-creation.feature-implementation. Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Keep neighboring code-creation services outside the feature implementation decision for code-creation.feature-implementation. Ground the decision in the configured input at `rig-services/development.code-creation.feature-implementation.json`; malformed input is still attributed to that path.

Disposition: executable. Use the limit: feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Choose a repository-owned check that observes feature implementation from rig-services/development.code-creation.feature-implementation.json.

Acceptance target: policy:development.code-creation.feature-implementation:minimal:feature-implementation-source-code-boundary.

Declared predicates: feature-implementation-source-code-boundary: `acceptance_cases` is nonempty (a string or array).
