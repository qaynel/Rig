# feature implementation

Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Owned scope: `code-creation.feature-implementation`.

Offer: Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Input: `rig-services/development.code-creation.feature-implementation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Select an approved repository-owned command to verify that behavior.

minimal: acceptance cases — ["creates an item","rejects invalid input"].

mid: change scope — ["src/items.js"].

maximal: compatibility — "preserve-existing-behavior".
