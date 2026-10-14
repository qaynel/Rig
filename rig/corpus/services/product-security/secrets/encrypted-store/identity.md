# product-security.secrets.encrypted-store — identity

encrypted store owns secrets.encrypted-store. Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Keep sibling services in secrets under their own verdicts. Use the configured input at `rig-services/product-security.secrets.encrypted-store.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: encrypted store configuration validation only; declared policy does not prove running encrypted store behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.secrets.encrypted-store:policy-boundary. Given source-code is present and secrets.encrypted-store is selected, pass only when the repository binding evaluates secrets.encrypted-store and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern.
