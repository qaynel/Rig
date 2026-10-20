# product-security.secrets.precommit-leak-scanner — mid

Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: precommit-leak-scanner-source-code-boundary, precommit-leak-scanner-secrets-context.

Inspect the existing repository's precommit leak scanner convention, then name the source path or command that establishes it. For precommit leak scanner, inspect the repository's actual spec, source, test, or configuration for scan_scope; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring secrets services outside the precommit leak scanner decision for secrets.precommit-leak-scanner.

Acceptance target: policy:product-security.secrets.precommit-leak-scanner:mid:precommit-leak-scanner-source-code-boundary+precommit-leak-scanner-secrets-context.

Declared predicates: precommit-leak-scanner-source-code-boundary: `scanner_command` is nonempty (a string or array); precommit-leak-scanner-secrets-context: `scan_scope` is nonempty (a string or array).
