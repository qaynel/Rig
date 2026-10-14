# development.code-creation.feature-implementation — floor and mutation-floor slice

Policy grade slice. This slice bounds feature implementation to code-creation.feature-implementation. It uses `feature-implementation-slice-floor` and checks acceptance_cases (nonempty): acceptance cases must name the concrete repository contract..

Read a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-creation.feature-implementation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Owned scope: `code-creation.feature-implementation`.

Offer: Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Input: `rig-services/development.code-creation.feature-implementation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Select an approved repository-owned command to verify that behavior.

minimal: acceptance cases — ["creates an item","rejects invalid input"].

mid: change scope — ["src/items.js"].

maximal: compatibility — "preserve-existing-behavior".
