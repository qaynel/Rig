# product-security.secrets.toy-relaxation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for toy relaxation. The minimal boundary for toy relaxation checks toy_scope (nonempty): toy scope must name the concrete repository contract.. Binding checks: toy-relaxation-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe secrets.toy-relaxation; bind it to the input named in `rig-services/product-security.secrets.toy-relaxation.json` and preserve the check's failure status. When adopting this in an existing repository, connect toy relaxation to the command that inspects toy_scope and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside secrets.toy-relaxation as a failure.

Acceptance target: fixture:product-security.secrets.toy-relaxation:policy-boundary. Given source-code is present and secrets.toy-relaxation is selected, pass only when the repository binding evaluates secrets.toy-relaxation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern. The ceiling is toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Choose a repository-owned check that observes toy relaxation from rig-services/product-security.secrets.toy-relaxation.json..

Service-specific evidence cues:
Offer: Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.
minimal: toy scope — ["local disposable fixture"].
mid: expires after days — 1.
maximal: permit production use — false.
