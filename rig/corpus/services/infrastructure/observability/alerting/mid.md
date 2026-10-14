# infrastructure.observability.alerting — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for alerting; it does not widen ownership beyond observability.alerting. For alerting, inspect these context signals: runbook_path. Binding checks: alerting-observability-context.

Ground the decision in the existing repository's alerting convention, then name the source path or command that establishes it. For alerting, inspect the repository's actual spec, source, test, or configuration for runbook_path; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring observability services outside the alerting decision for observability.alerting.

Acceptance target: fixture:infrastructure.observability.alerting:repository-context. Given observability.alerting has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent observability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.
minimal: alert conditions — ["error budget burn"].
mid: runbook path — "docs/runbook.md".
maximal: alert without owner — false.
