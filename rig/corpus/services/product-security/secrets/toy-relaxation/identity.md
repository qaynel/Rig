# product-security.secrets.toy-relaxation — identity

Policy grade: toy relaxation owns secrets.toy-relaxation. Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Keep neighboring secrets services outside the toy relaxation decision for secrets.toy-relaxation. Use the configured input at `rig-services/product-security.secrets.toy-relaxation.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Choose a repository-owned check that observes toy relaxation from rig-services/product-security.secrets.toy-relaxation.json.

Acceptance target: policy:product-security.secrets.toy-relaxation:minimal:toy-relaxation-source-code-boundary.

Declared predicates: toy-relaxation-source-code-boundary: `toy_scope` is nonempty (a string or array).
