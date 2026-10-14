# development.architecture.tech-debt — property-floor slice

Policy grade slice. This slice bounds tech debt to architecture.tech-debt. It uses `tech-debt-slice-property-floor` and checks debt_items (nonempty): debt items must name the concrete repository contract..

For tech debt, choose a repository example that satisfies debt_items at the property-floor floor, plus a failure where debt items must name the concrete repository contract. is false. For tech debt, wire `property-floor` to `rig-services/development.architecture.tech-debt.json` and keep its verdict on debt_items; missing evidence is a named gap, with ceiling tech debt configuration validation only; declared policy does not prove running tech debt behavior. Choose a repository-owned check that observes tech debt from rig-services/development.architecture.tech-debt.json..

Service-specific evidence cues:
Offer: Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.
minimal: debt items — ["replace duplicated parser"].
mid: owners — ["platform"].
maximal: exit criteria — ["single parser with compatibility checks"].
