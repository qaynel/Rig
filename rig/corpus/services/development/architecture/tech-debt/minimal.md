# development.architecture.tech-debt — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for tech debt. The minimal boundary for tech debt checks debt_items (nonempty): debt items must name the concrete repository contract.. Binding checks: tech-debt-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe architecture.tech-debt; bind it to the input named in `rig-services/development.architecture.tech-debt.json` and preserve the check's failure status. When adopting this in an existing repository, connect tech debt to the command that inspects debt_items and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside architecture.tech-debt as a failure.

Acceptance target: fixture:development.architecture.tech-debt:policy-boundary. Given source-code is present and architecture.tech-debt is selected, pass only when the repository binding evaluates architecture.tech-debt and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern. The ceiling is tech debt configuration validation only; declared policy does not prove running tech debt behavior. Choose a repository-owned check that observes tech debt from rig-services/development.architecture.tech-debt.json..

Service-specific evidence cues:
Offer: Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.
minimal: debt items — ["replace duplicated parser"].
mid: owners — ["platform"].
maximal: exit criteria — ["single parser with compatibility checks"].
