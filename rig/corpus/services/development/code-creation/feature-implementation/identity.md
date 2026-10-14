# development.code-creation.feature-implementation — identity

Policy grade: feature implementation owns code-creation.feature-implementation. Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Keep sibling services in code-creation under their own verdicts. Ground the decision in the configured input at `rig-services/development.code-creation.feature-implementation.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-creation.feature-implementation:policy-boundary. Given source-code is present and code-creation.feature-implementation is selected, pass only when the repository binding evaluates code-creation.feature-implementation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern.

Service-specific evidence cues:
Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Owned scope: `code-creation.feature-implementation`.

Offer: Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Input: `rig-services/development.code-creation.feature-implementation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Select an approved repository-owned command to verify that behavior.

minimal: acceptance cases — ["creates an item","rejects invalid input"].

mid: change scope — ["src/items.js"].

maximal: compatibility — "preserve-existing-behavior".
