# infrastructure.observability.alerting — behavior-oracle slice

Policy grade slice. This slice bounds alerting to observability.alerting. It uses `alerting-slice-behavior-oracle` and checks alert_conditions (nonempty): alert conditions must name the concrete repository contract..

For alerting, choose a repository example that satisfies alert_conditions at the behavior-oracle floor, plus a failure where alert conditions must name the concrete repository contract. is false. For alerting, wire `behavior-oracle` to `rig-services/infrastructure.observability.alerting.json` and keep its verdict on alert_conditions; missing evidence is a named gap, with ceiling alerting configuration validation only; declared policy does not prove running alerting behavior. Choose a repository-owned check that observes alerting from rig-services/infrastructure.observability.alerting.json..

Service-specific evidence cues:
Offer: Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.
minimal: alert conditions — ["error budget burn"].
mid: runbook path — "docs/runbook.md".
maximal: alert without owner — false.
