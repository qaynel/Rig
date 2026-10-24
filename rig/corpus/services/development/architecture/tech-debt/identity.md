# development.architecture.tech-debt — identity

Policy grade: tech-debt owns architecture.tech-debt. Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Input: `rig-services/development.architecture.tech-debt.json`. Configuration validation only, so it confirms debt items, owners and exit criteria are written down; it does not show that any debt is repaid or the cost measured.

Disposition: executable.
Acceptance target: policy:development.architecture.tech-debt:minimal:tech-debt-source-code-boundary.
Declared predicates: tech-debt-source-code-boundary: `debt_items` is nonempty (a string or array).
