# product-security.red-team.abuse-resistance — minimal

Minimal establishes a non-vacuous policy boundary for abuse resistance. It checks abuse_cases (nonempty): abuse cases must name the concrete repository contract..

Inspect a repository-owned command or existing native check that can observe red-team.abuse-resistance; bind it to the input named in `rig-services/product-security.red-team.abuse-resistance.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside red-team.abuse-resistance is a failure.

Acceptance target: fixture:product-security.red-team.abuse-resistance:policy-boundary. Given source-code is present and red-team.abuse-resistance is selected, pass only when the repository binding evaluates red-team.abuse-resistance and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. A passing policy check does not establish runtime behavior.
