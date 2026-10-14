# development.architecture.tech-debt — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for tech debt. It checks debt_items (nonempty): debt items must name the concrete repository contract.. Binding checks: tech-debt-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe architecture.tech-debt; bind it to the input named in `rig-services/development.architecture.tech-debt.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside architecture.tech-debt is a failure.

Acceptance target: fixture:development.architecture.tech-debt:policy-boundary. Given source-code is present and architecture.tech-debt is selected, pass only when the repository binding evaluates architecture.tech-debt and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Owned scope: `architecture.tech-debt`.

Offer: Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Input: `rig-services/development.architecture.tech-debt.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: tech debt configuration validation only; declared policy does not prove running tech debt behavior. Select an approved repository-owned command to verify that behavior.

minimal: debt items — ["replace duplicated parser"].

mid: owners — ["platform"].

maximal: exit criteria — ["single parser with compatibility checks"].
