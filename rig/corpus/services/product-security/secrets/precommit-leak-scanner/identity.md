# product-security.secrets.precommit-leak-scanner — identity

Policy grade: precommit leak scanner owns secrets.precommit-leak-scanner. Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Keep neighboring secrets services outside the precommit leak scanner decision for secrets.precommit-leak-scanner. Start from the configured input at `rig-services/product-security.secrets.precommit-leak-scanner.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Choose a repository-owned check that observes precommit leak scanner from rig-services/product-security.secrets.precommit-leak-scanner.json.

Acceptance target: policy:product-security.secrets.precommit-leak-scanner:minimal:precommit-leak-scanner-source-code-boundary.

Declared predicates: precommit-leak-scanner-source-code-boundary: `scanner_command` is nonempty (a string or array).
