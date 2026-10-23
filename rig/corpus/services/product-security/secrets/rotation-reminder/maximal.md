# product-security.secrets.rotation-reminder — maximal

Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Policy grade, maximal: Set rotation without an owner to false. A reminder nobody owns is ignored, so assign a responsible person or team. Cumulative with minimal and mid. Binding checks: rotation-reminder-source-code-boundary, rotation-reminder-secrets-context, rotation-reminder-evidence-receipt.

Acceptance target: policy:product-security.secrets.rotation-reminder:maximal:rotation-reminder-source-code-boundary+rotation-reminder-secrets-context+rotation-reminder-evidence-receipt.
Declared predicates: rotation-reminder-source-code-boundary: `credential_classes` is nonempty (a string or array); rotation-reminder-secrets-context: `rotation_interval_days` is numeric and at least 90; rotation-reminder-evidence-receipt: `rotation_without_owner` equals false.
