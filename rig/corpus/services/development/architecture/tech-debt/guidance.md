# tech-debt

Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Owned scope: `architecture.tech-debt`. Input: `rig-services/development.architecture.tech-debt.json`.

Coverage ceiling: Configuration validation only, so it confirms debt items, owners and exit criteria are written down; it does not show that any debt is repaid or the cost measured.

minimal: debt items — ["replace duplicated parser"]. List each debt item as an observable cost, not a cleanup label. An empty list gives maintenance work nothing to target, so name the concrete cost and where it lives.

mid: owners — ["platform"]. Name an accountable owner for the debt. Unowned debt is never scheduled, so assign a person or team to every listed item.

maximal: exit criteria — ["single parser with compatibility checks"]. State the exit criteria that mark each item done. Without a completion condition a cleanup never ends, so write the observable check that closes it.
