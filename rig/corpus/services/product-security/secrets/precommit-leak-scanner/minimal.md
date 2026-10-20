# product-security.secrets.precommit-leak-scanner — minimal

Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for precommit leak scanner. The minimal boundary for precommit leak scanner checks scanner_command (nonempty): scanner command must name the concrete repository contract. Binding checks: precommit-leak-scanner-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe secrets.precommit-leak-scanner; bind it to the input named in `rig-services/product-security.secrets.precommit-leak-scanner.json` and preserve the check's failure status. When adopting this in an existing repository, connect precommit leak scanner to the command that inspects scanner_command and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside secrets.precommit-leak-scanner as a failure.

Acceptance target: policy:product-security.secrets.precommit-leak-scanner:minimal:precommit-leak-scanner-source-code-boundary.

Declared predicates: precommit-leak-scanner-source-code-boundary: `scanner_command` is nonempty (a string or array).
