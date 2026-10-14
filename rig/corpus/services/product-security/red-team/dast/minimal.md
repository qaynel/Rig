# product-security.red-team.dast — minimal

Minimal establishes a non-vacuous policy boundary for dast. It checks target_origin (nonempty): target origin must name the concrete repository contract..

Tie acceptance to a repository-owned command or existing native check that can observe red-team.dast; bind it to the input named in `rig-services/product-security.red-team.dast.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside red-team.dast is a failure.

Acceptance target: fixture:product-security.red-team.dast:policy-boundary. Given source-code is present and red-team.dast is selected, pass only when the repository binding evaluates red-team.dast and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. A passing policy check does not establish runtime behavior.
