# product-security.secrets.precommit-leak-scanner — maximal

Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: precommit-leak-scanner-source-code-boundary, precommit-leak-scanner-secrets-context, precommit-leak-scanner-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:product-security.secrets.precommit-leak-scanner:maximal:precommit-leak-scanner-source-code-boundary+precommit-leak-scanner-secrets-context+precommit-leak-scanner-evidence-receipt.

Declared predicates: precommit-leak-scanner-source-code-boundary: `scanner_command` is nonempty (a string or array); precommit-leak-scanner-secrets-context: `scan_scope` is nonempty (a string or array); precommit-leak-scanner-evidence-receipt: `ignore_scanner_exit` equals false.
