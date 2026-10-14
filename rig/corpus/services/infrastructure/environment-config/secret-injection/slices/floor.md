# infrastructure.environment-config.secret-injection — floor and mutation-floor slice

This slice bounds secret injection to runtime-secret-injection, secret-injection-wiring. It uses `secret-injection-slice-floor` and checks secret_references (nonempty): secret references must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.environment-config.secret-injection.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than secret injection configuration validation only; declared policy does not prove running secret injection behavior. Select an approved repository-owned command to verify that behavior.
