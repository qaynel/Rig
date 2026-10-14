# development.architecture.tech-debt — identity

Policy grade: tech debt owns architecture.tech-debt. Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Keep neighboring architecture services outside the tech debt decision for architecture.tech-debt. Anchor the review on the configured input at `rig-services/development.architecture.tech-debt.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: tech debt configuration validation only; declared policy does not prove running tech debt behavior. Choose a repository-owned check that observes tech debt from rig-services/development.architecture.tech-debt.json.

Acceptance target: fixture:development.architecture.tech-debt:policy-boundary. Given source-code is present and architecture.tech-debt is selected, pass only when the repository binding evaluates architecture.tech-debt and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern.

Service-specific evidence cues:
Offer: Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.
minimal: debt items — ["replace duplicated parser"].
mid: owners — ["platform"].
maximal: exit criteria — ["single parser with compatibility checks"].
