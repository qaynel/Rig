# product-security.secrets.rotation-reminder — minimal

Minimal establishes a non-vacuous policy boundary for rotation reminder. It checks credential_classes (nonempty): credential classes must name the concrete repository contract..

Ground the decision in a repository-owned command or existing native check that can observe secrets.rotation-reminder; bind it to the input named in `rig-services/product-security.secrets.rotation-reminder.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside secrets.rotation-reminder is a failure.

Acceptance target: fixture:product-security.secrets.rotation-reminder:policy-boundary. Given source-code is present and secrets.rotation-reminder is selected, pass only when the repository binding evaluates secrets.rotation-reminder and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern. A passing policy check does not establish runtime behavior.
