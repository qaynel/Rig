# product-security.secrets.rotation-reminder — identity

Policy grade: rotation-reminder owns secrets.rotation-reminder. Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Input: `rig-services/product-security.secrets.rotation-reminder.json`. Configuration validation only, so it confirms credential classes, a rotation interval and the ownerless flag are declared; it does not show any credential was rotated.

Disposition: executable.
Acceptance target: policy:product-security.secrets.rotation-reminder:minimal:rotation-reminder-source-code-boundary.
Declared predicates: rotation-reminder-source-code-boundary: `credential_classes` is nonempty (a string or array).
