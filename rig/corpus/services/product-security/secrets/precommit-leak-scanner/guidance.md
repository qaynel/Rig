# precommit-leak-scanner

Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Owned scope: `secrets.precommit-leak-scanner`. Input: `rig-services/product-security.secrets.precommit-leak-scanner.json`.

Coverage ceiling: Configuration validation only, so it confirms the scanner command, scan scope and the ignore-exit flag are declared; it does not run the scanner.

minimal: scanner command — ["gitleaks","protect"]. Declare the scanner command run on staged changes. A missing scanner needs installation guidance, not a clean claim, so name the tool.

mid: scan scope — "staged-diff". Declare what the scan covers, such as staged files. An undefined scope may skip content, so state it.

maximal: ignore scanner exit — false. Set ignoring the scanner exit status to false. A scanner failure must block, otherwise a leak passes, so keep its exit authoritative.
