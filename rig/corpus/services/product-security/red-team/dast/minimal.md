# product-security.red-team.dast — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for dast. The minimal boundary for dast checks target_origin (nonempty): target origin must name the concrete repository contract.. Binding checks: dast-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe red-team.dast; bind it to the input named in `rig-services/product-security.red-team.dast.json` and preserve the check's failure status. When adopting this in an existing repository, connect dast to the command that inspects target_origin and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside red-team.dast as a failure.

Acceptance target: fixture:product-security.red-team.dast:policy-boundary. Given source-code is present and red-team.dast is selected, pass only when the repository binding evaluates red-team.dast and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. The ceiling is dast configuration validation only; declared policy does not prove running dast behavior. Choose a repository-owned check that observes dast from rig-services/product-security.red-team.dast.json..

Service-specific evidence cues:
Offer: Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.
minimal: target origin — "http://127.0.0.1:8080".
mid: authorized scope — ["/api"].
maximal: scan unapproved targets — false.
