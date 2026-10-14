# product-security.secrets.toy-relaxation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for toy relaxation. It checks toy_scope (nonempty): toy scope must name the concrete repository contract.. Binding checks: toy-relaxation-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe secrets.toy-relaxation; bind it to the input named in `rig-services/product-security.secrets.toy-relaxation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside secrets.toy-relaxation is a failure.

Acceptance target: fixture:product-security.secrets.toy-relaxation:policy-boundary. Given source-code is present and secrets.toy-relaxation is selected, pass only when the repository binding evaluates secrets.toy-relaxation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Owned scope: `secrets.toy-relaxation`.

Offer: Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Input: `rig-services/product-security.secrets.toy-relaxation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Select an approved repository-owned command to verify that behavior.

minimal: toy scope — ["local disposable fixture"].

mid: expires after days — 1.

maximal: permit production use — false.
