# product-security.secrets.rotation-reminder — mid

Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Policy grade, mid: Set a rotation interval in days, at least 90 declared. An unscheduled credential lives forever, so set the interval. Cumulative with minimal. Binding checks: rotation-reminder-source-code-boundary, rotation-reminder-secrets-context.

Acceptance target: policy:product-security.secrets.rotation-reminder:mid:rotation-reminder-source-code-boundary+rotation-reminder-secrets-context.
Declared predicates: rotation-reminder-source-code-boundary: `credential_classes` is nonempty (a string or array); rotation-reminder-secrets-context: `rotation_interval_days` is numeric and at least 90.
