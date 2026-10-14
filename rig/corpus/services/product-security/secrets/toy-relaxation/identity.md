# product-security.secrets.toy-relaxation — identity

toy relaxation owns secrets.toy-relaxation. Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Keep sibling services in secrets under their own verdicts. Use the configured input at `rig-services/product-security.secrets.toy-relaxation.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.secrets.toy-relaxation:policy-boundary. Given source-code is present and secrets.toy-relaxation is selected, pass only when the repository binding evaluates secrets.toy-relaxation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern.
