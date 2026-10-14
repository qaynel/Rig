# product-security.secrets.toy-relaxation — minimal

Minimal establishes a non-vacuous policy boundary for toy relaxation. It checks toy_scope (nonempty): toy scope must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe secrets.toy-relaxation; bind it to the input named in `rig-services/product-security.secrets.toy-relaxation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside secrets.toy-relaxation is a failure.

Acceptance target: fixture:product-security.secrets.toy-relaxation:policy-boundary. Given source-code is present and secrets.toy-relaxation is selected, pass only when the repository binding evaluates secrets.toy-relaxation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern. A passing policy check does not establish runtime behavior.
