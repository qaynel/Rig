# development.code-creation.feature-implementation — identity

Policy grade: feature implementation owns code-creation.feature-implementation. Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Keep neighboring code-creation services outside the feature implementation decision for code-creation.feature-implementation. Ground the decision in the configured input at `rig-services/development.code-creation.feature-implementation.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Choose a repository-owned check that observes feature implementation from rig-services/development.code-creation.feature-implementation.json.

Acceptance target: fixture:development.code-creation.feature-implementation:policy-boundary. Given source-code is present and code-creation.feature-implementation is selected, pass only when the repository binding evaluates code-creation.feature-implementation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern.

Service-specific evidence cues:
Offer: Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.
minimal: acceptance cases — ["creates an item","rejects invalid input"].
mid: change scope — ["src/items.js"].
maximal: compatibility — "preserve-existing-behavior".
