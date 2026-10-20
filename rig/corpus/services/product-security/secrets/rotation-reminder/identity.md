# product-security.secrets.rotation-reminder — identity

Policy grade: rotation reminder owns secrets.rotation-reminder. Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Keep neighboring secrets services outside the rotation reminder decision for secrets.rotation-reminder. Tie acceptance to the configured input at `rig-services/product-security.secrets.rotation-reminder.json`; malformed input is still attributed to that path.

Disposition: executable. Read the limit: rotation reminder configuration validation only; declared policy does not prove running rotation reminder behavior. Choose a repository-owned check that observes rotation reminder from rig-services/product-security.secrets.rotation-reminder.json.

Acceptance target: policy:product-security.secrets.rotation-reminder:minimal:rotation-reminder-source-code-boundary.

Declared predicates: rotation-reminder-source-code-boundary: `credential_classes` is nonempty (a string or array).
