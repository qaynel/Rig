# development.architecture.tech-debt — identity

Policy grade: tech debt owns architecture.tech-debt. Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Keep sibling services in architecture under their own verdicts. Anchor the review on the configured input at `rig-services/development.architecture.tech-debt.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: tech debt configuration validation only; declared policy does not prove running tech debt behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.architecture.tech-debt:policy-boundary. Given source-code is present and architecture.tech-debt is selected, pass only when the repository binding evaluates architecture.tech-debt and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern.

Service-specific evidence cues:
Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Owned scope: `architecture.tech-debt`.

Offer: Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Input: `rig-services/development.architecture.tech-debt.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: tech debt configuration validation only; declared policy does not prove running tech debt behavior. Select an approved repository-owned command to verify that behavior.

minimal: debt items — ["replace duplicated parser"].

mid: owners — ["platform"].

maximal: exit criteria — ["single parser with compatibility checks"].
