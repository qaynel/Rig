# product-security.secrets.encrypted-store — minimal

Minimal establishes a non-vacuous policy boundary for encrypted store. It checks secret_store (nonempty): secret store must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe secrets.encrypted-store; bind it to the input named in `rig-services/product-security.secrets.encrypted-store.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside secrets.encrypted-store is a failure.

Acceptance target: fixture:product-security.secrets.encrypted-store:policy-boundary. Given source-code is present and secrets.encrypted-store is selected, pass only when the repository binding evaluates secrets.encrypted-store and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern. A passing policy check does not establish runtime behavior.
