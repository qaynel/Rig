# product-security.secrets.rotation-reminder — maximal

Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: rotation-reminder-source-code-boundary, rotation-reminder-secrets-context, rotation-reminder-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:product-security.secrets.rotation-reminder:maximal:rotation-reminder-source-code-boundary+rotation-reminder-secrets-context+rotation-reminder-evidence-receipt.

Declared predicates: rotation-reminder-source-code-boundary: `credential_classes` is nonempty (a string or array); rotation-reminder-secrets-context: `rotation_interval_days` is numeric and at least 90; rotation-reminder-evidence-receipt: `rotation_without_owner` equals false.
