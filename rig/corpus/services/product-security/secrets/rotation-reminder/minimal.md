# product-security.secrets.rotation-reminder — minimal

Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Policy grade, minimal: List the credential classes covered, such as API keys and deploy tokens. Unlisted classes never rotate, so name them. Binding checks: rotation-reminder-source-code-boundary.

Acceptance target: policy:product-security.secrets.rotation-reminder:minimal:rotation-reminder-source-code-boundary.
Declared predicates: rotation-reminder-source-code-boundary: `credential_classes` is nonempty (a string or array).
