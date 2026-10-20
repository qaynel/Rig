# development.architecture.tech-debt — behavior-oracle slice

Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Policy grade slice `tech-debt-slice-behavior-oracle`: List each debt item as an observable cost, not a cleanup label. An empty list gives maintenance work nothing to target, so name the concrete cost and where it lives. Despite its name this slice is not a behavior oracle: it confirms debt items, owners and exit criteria are written down; it does not show that any debt is repaid or the cost measured.
