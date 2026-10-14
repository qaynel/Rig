# product-security.secrets.precommit-leak-scanner — identity

precommit leak scanner owns secrets.precommit-leak-scanner. Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Keep sibling services in secrets under their own verdicts. Start from the configured input at `rig-services/product-security.secrets.precommit-leak-scanner.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.secrets.precommit-leak-scanner:policy-boundary. Given source-code is present and secrets.precommit-leak-scanner is selected, pass only when the repository binding evaluates secrets.precommit-leak-scanner and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern.
