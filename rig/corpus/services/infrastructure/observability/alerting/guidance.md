# alerting

Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Owned scope: `observability.alerting`. Input: `rig-services/infrastructure.observability.alerting.json`.

Coverage ceiling: Configuration validation only, so it confirms alert conditions, a runbook path and the ownerless-alert flag are declared; it does not show alerts fire or reach anyone.

minimal: alert conditions — ["error budget burn"]. List the conditions that alert. An alert with no stated condition is noise, so name each signal and threshold.

mid: runbook path — "docs/runbook.md". Point each alert to a runbook. An alert without a response path is a page nobody can act on, so give the path.

maximal: alert without owner — false. Set alert without owner to false. An unowned alert is ignored, so assign an on-call owner.
