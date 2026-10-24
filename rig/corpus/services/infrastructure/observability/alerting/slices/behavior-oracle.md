# infrastructure.observability.alerting — behavior-oracle slice

Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Policy grade slice `alerting-slice-behavior-oracle`: List the conditions that alert. An alert with no stated condition is noise, so name each signal and threshold. Despite its name this slice is not a behavior oracle: it confirms alert conditions, a runbook path and the ownerless-alert flag are declared; it does not show alerts fire or reach anyone.
