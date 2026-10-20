# development.architecture.tech-debt — identity

Policy grade: tech debt owns architecture.tech-debt. Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Keep neighboring architecture services outside the tech debt decision for architecture.tech-debt. Anchor the review on the configured input at `rig-services/development.architecture.tech-debt.json`; malformed input is still attributed to that path.

Disposition: executable. Inspect the limit: tech debt configuration validation only; declared policy does not prove running tech debt behavior. Choose a repository-owned check that observes tech debt from rig-services/development.architecture.tech-debt.json.

Acceptance target: policy:development.architecture.tech-debt:minimal:tech-debt-source-code-boundary.

Declared predicates: tech-debt-source-code-boundary: `debt_items` is nonempty (a string or array).
