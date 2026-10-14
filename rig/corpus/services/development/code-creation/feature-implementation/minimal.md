# development.code-creation.feature-implementation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for feature implementation. The minimal boundary for feature implementation checks acceptance_cases (nonempty): acceptance cases must name the concrete repository contract.. Binding checks: feature-implementation-source-code-boundary.

Start from a repository-owned command or existing native check that can observe code-creation.feature-implementation; bind it to the input named in `rig-services/development.code-creation.feature-implementation.json` and preserve the check's failure status. When adopting this in an existing repository, connect feature implementation to the command that inspects acceptance_cases and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-creation.feature-implementation as a failure.

Acceptance target: fixture:development.code-creation.feature-implementation:policy-boundary. Given source-code is present and code-creation.feature-implementation is selected, pass only when the repository binding evaluates code-creation.feature-implementation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern. The ceiling is feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Choose a repository-owned check that observes feature implementation from rig-services/development.code-creation.feature-implementation.json..

Service-specific evidence cues:
Offer: Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.
minimal: acceptance cases — ["creates an item","rejects invalid input"].
mid: change scope — ["src/items.js"].
maximal: compatibility — "preserve-existing-behavior".
