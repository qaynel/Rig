# product-security.secrets.precommit-leak-scanner — property-floor slice

Run the available leak scanner against the staged change and keep its failure authoritative. A missing scanner needs installation guidance rather than a clean secret-safety claim.

Policy grade slice. This slice bounds precommit leak scanner to secrets.precommit-leak-scanner. It uses `precommit-leak-scanner-slice-property-floor` and checks scanner_command (nonempty): scanner command must name the concrete repository contract.