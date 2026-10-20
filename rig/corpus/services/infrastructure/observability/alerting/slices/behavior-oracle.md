# infrastructure.observability.alerting — behavior-oracle slice

Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Policy grade slice. This slice bounds alerting to observability.alerting. It uses `alerting-slice-behavior-oracle` and checks alert_conditions (nonempty): alert conditions must name the concrete repository contract.