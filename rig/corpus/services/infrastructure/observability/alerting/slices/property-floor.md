# infrastructure.observability.alerting — property-floor slice

Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Policy grade slice `alerting-slice-property-floor`: List the conditions that alert. An alert with no stated condition is noise, so name each signal and threshold.
