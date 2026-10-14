# product-security.secrets.rotation-reminder — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for rotation reminder. The minimal boundary for rotation reminder checks credential_classes (nonempty): credential classes must name the concrete repository contract.. Binding checks: rotation-reminder-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe secrets.rotation-reminder; bind it to the input named in `rig-services/product-security.secrets.rotation-reminder.json` and preserve the check's failure status. When adopting this in an existing repository, connect rotation reminder to the command that inspects credential_classes and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside secrets.rotation-reminder as a failure.

Acceptance target: fixture:product-security.secrets.rotation-reminder:policy-boundary. Given source-code is present and secrets.rotation-reminder is selected, pass only when the repository binding evaluates secrets.rotation-reminder and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern. The ceiling is rotation reminder configuration validation only; declared policy does not prove running rotation reminder behavior. Choose a repository-owned check that observes rotation reminder from rig-services/product-security.secrets.rotation-reminder.json..

Service-specific evidence cues:
Offer: Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.
minimal: credential classes — ["service token"].
mid: rotation interval days — 90.
maximal: rotation without owner — false.
