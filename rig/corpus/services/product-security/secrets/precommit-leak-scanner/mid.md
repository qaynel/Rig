# product-security.secrets.precommit-leak-scanner — mid

Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Policy grade, mid: Declare what the scan covers, such as staged files. An undefined scope may skip content, so state it. Cumulative with minimal. Binding checks: precommit-leak-scanner-source-code-boundary, precommit-leak-scanner-secrets-context.

Acceptance target: policy:product-security.secrets.precommit-leak-scanner:mid:precommit-leak-scanner-source-code-boundary+precommit-leak-scanner-secrets-context.
Declared predicates: precommit-leak-scanner-source-code-boundary: `scanner_command` is nonempty (a string or array); precommit-leak-scanner-secrets-context: `scan_scope` is nonempty (a string or array).
