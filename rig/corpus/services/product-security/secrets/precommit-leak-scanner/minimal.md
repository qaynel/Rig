# product-security.secrets.precommit-leak-scanner — minimal

Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Policy grade, minimal: Declare the scanner command run on staged changes. A missing scanner needs installation guidance, not a clean claim, so name the tool. Binding checks: precommit-leak-scanner-source-code-boundary.

Acceptance target: policy:product-security.secrets.precommit-leak-scanner:minimal:precommit-leak-scanner-source-code-boundary.
Declared predicates: precommit-leak-scanner-source-code-boundary: `scanner_command` is nonempty (a string or array).
