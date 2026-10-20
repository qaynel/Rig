# infrastructure.observability.alerting — minimal

Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for alerting. The minimal boundary for alerting checks alert_conditions (nonempty): alert conditions must name the concrete repository contract. Binding checks: alerting-source-code-boundary.

Read a repository-owned command or existing native check that can observe observability.alerting; bind it to the input named in `rig-services/infrastructure.observability.alerting.json` and preserve the check's failure status. When adopting this in an existing repository, connect alerting to the command that inspects alert_conditions and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside observability.alerting as a failure.

Acceptance target: policy:infrastructure.observability.alerting:minimal:alerting-source-code-boundary.

Declared predicates: alerting-source-code-boundary: `alert_conditions` is nonempty (a string or array).
