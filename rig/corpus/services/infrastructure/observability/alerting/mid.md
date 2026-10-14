# infrastructure.observability.alerting — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for alerting; it does not widen ownership beyond observability.alerting. The context signals are runbook_path. Binding checks: alerting-observability-context.

Ground the decision in the existing repository's alerting convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in observability under their own verdicts.

Acceptance target: fixture:infrastructure.observability.alerting:repository-context. Given observability.alerting has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent observability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Owned scope: `observability.alerting`.

Offer: Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Input: `rig-services/infrastructure.observability.alerting.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: alerting configuration validation only; declared policy does not prove running alerting behavior. Select an approved repository-owned command to verify that behavior.

minimal: alert conditions — ["error budget burn"].

mid: runbook path — "docs/runbook.md".

maximal: alert without owner — false.
