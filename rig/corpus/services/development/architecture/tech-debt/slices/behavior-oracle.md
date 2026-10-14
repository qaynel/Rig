# development.architecture.tech-debt — behavior-oracle slice

Policy grade slice. This slice bounds tech debt to architecture.tech-debt. It uses `tech-debt-slice-behavior-oracle` and checks debt_items (nonempty): debt items must name the concrete repository contract..

Start from a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.architecture.tech-debt.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than tech debt configuration validation only; declared policy does not prove running tech debt behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Owned scope: `architecture.tech-debt`.

Offer: Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Input: `rig-services/development.architecture.tech-debt.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: tech debt configuration validation only; declared policy does not prove running tech debt behavior. Select an approved repository-owned command to verify that behavior.

minimal: debt items — ["replace duplicated parser"].

mid: owners — ["platform"].

maximal: exit criteria — ["single parser with compatibility checks"].
