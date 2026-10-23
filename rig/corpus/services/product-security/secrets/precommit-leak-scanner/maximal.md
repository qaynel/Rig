# product-security.secrets.precommit-leak-scanner — maximal

Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Policy grade, maximal: Set ignoring the scanner exit status to false. A scanner failure must block, otherwise a leak passes, so keep its exit authoritative. Cumulative with minimal and mid. Binding checks: precommit-leak-scanner-source-code-boundary, precommit-leak-scanner-secrets-context, precommit-leak-scanner-evidence-receipt.

Acceptance target: policy:product-security.secrets.precommit-leak-scanner:maximal:precommit-leak-scanner-source-code-boundary+precommit-leak-scanner-secrets-context+precommit-leak-scanner-evidence-receipt.
Declared predicates: precommit-leak-scanner-source-code-boundary: `scanner_command` is nonempty (a string or array); precommit-leak-scanner-secrets-context: `scan_scope` is nonempty (a string or array); precommit-leak-scanner-evidence-receipt: `ignore_scanner_exit` equals false.
