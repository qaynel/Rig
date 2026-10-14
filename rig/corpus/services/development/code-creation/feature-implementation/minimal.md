# development.code-creation.feature-implementation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for feature implementation. It checks acceptance_cases (nonempty): acceptance cases must name the concrete repository contract.. Binding checks: feature-implementation-source-code-boundary.

Start from a repository-owned command or existing native check that can observe code-creation.feature-implementation; bind it to the input named in `rig-services/development.code-creation.feature-implementation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside code-creation.feature-implementation is a failure.

Acceptance target: fixture:development.code-creation.feature-implementation:policy-boundary. Given source-code is present and code-creation.feature-implementation is selected, pass only when the repository binding evaluates code-creation.feature-implementation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Owned scope: `code-creation.feature-implementation`.

Offer: Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Input: `rig-services/development.code-creation.feature-implementation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Select an approved repository-owned command to verify that behavior.

minimal: acceptance cases — ["creates an item","rejects invalid input"].

mid: change scope — ["src/items.js"].

maximal: compatibility — "preserve-existing-behavior".
