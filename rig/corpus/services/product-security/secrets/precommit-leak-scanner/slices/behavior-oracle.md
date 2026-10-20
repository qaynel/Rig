# product-security.secrets.precommit-leak-scanner — behavior-oracle slice

Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Policy grade slice `precommit-leak-scanner-slice-behavior-oracle`: Declare the scanner command run on staged changes. A missing scanner needs installation guidance, not a clean claim, so name the tool. Despite its name this slice is not a behavior oracle: it confirms the scanner command, scan scope and the ignore-exit flag are declared; it does not run the scanner.
