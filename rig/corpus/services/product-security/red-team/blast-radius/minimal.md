# product-security.red-team.blast-radius — minimal

Minimal establishes a non-vacuous policy boundary for blast radius. It checks privilege_scopes (nonempty): privilege scopes must name the concrete repository contract..

Start from a repository-owned command or existing native check that can observe red-team.blast-radius; bind it to the input named in `rig-services/product-security.red-team.blast-radius.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside red-team.blast-radius is a failure.

Acceptance target: fixture:product-security.red-team.blast-radius:policy-boundary. Given source-code is present and red-team.blast-radius is selected, pass only when the repository binding evaluates red-team.blast-radius and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. A passing policy check does not establish runtime behavior.
