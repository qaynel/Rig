# tech debt

Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Owned scope: `architecture.tech-debt`.

Offer: Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Input: `rig-services/development.architecture.tech-debt.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: tech debt configuration validation only; declared policy does not prove running tech debt behavior. Select an approved repository-owned command to verify that behavior.

minimal: debt items — ["replace duplicated parser"].

mid: owners — ["platform"].

maximal: exit criteria — ["single parser with compatibility checks"].
