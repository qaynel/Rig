# development.code-quality.typecheck — behavior-oracle slice

This slice bounds typecheck to code-quality.typecheck. It uses `typecheck-slice-behavior-oracle` and checks typecheck_command (nonempty): typecheck command must name the concrete repository contract..

Inspect a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-quality.typecheck.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than typecheck configuration validation only; declared policy does not prove running typecheck behavior. Select an approved repository-owned command to verify that behavior.
