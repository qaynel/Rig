# product-security.secrets.precommit-leak-scanner — floor and mutation-floor slice

This slice bounds precommit leak scanner to secrets.precommit-leak-scanner. It uses `precommit-leak-scanner-slice-floor` and checks scanner_command (nonempty): scanner command must name the concrete repository contract..

Use a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.secrets.precommit-leak-scanner.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than precommit leak scanner configuration validation only; declared policy does not prove running precommit leak scanner behavior. Select an approved repository-owned command to verify that behavior.
