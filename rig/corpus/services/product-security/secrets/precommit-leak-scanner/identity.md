# product-security.secrets.precommit-leak-scanner — identity

Policy grade: precommit-leak-scanner owns secrets.precommit-leak-scanner. Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Input: `rig-services/product-security.secrets.precommit-leak-scanner.json`. Configuration validation only, so it confirms the scanner command, scan scope and the ignore-exit flag are declared; it does not run the scanner.

Disposition: executable.
Acceptance target: policy:product-security.secrets.precommit-leak-scanner:minimal:precommit-leak-scanner-source-code-boundary.
Declared predicates: precommit-leak-scanner-source-code-boundary: `scanner_command` is nonempty (a string or array).
