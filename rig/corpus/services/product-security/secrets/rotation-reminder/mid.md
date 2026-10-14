# product-security.secrets.rotation-reminder — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for rotation reminder; it does not widen ownership beyond secrets.rotation-reminder. For rotation reminder, inspect these context signals: rotation_interval_days. Binding checks: rotation-reminder-secrets-context.

Use the existing repository's rotation reminder convention, then name the source path or command that establishes it. For rotation reminder, inspect the repository's actual spec, source, test, or configuration for rotation_interval_days; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring secrets services outside the rotation reminder decision for secrets.rotation-reminder.

Acceptance target: fixture:product-security.secrets.rotation-reminder:repository-context. Given secrets.rotation-reminder has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent secrets concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.
minimal: credential classes — ["service token"].
mid: rotation interval days — 90.
maximal: rotation without owner — false.
