# product-security.red-team.auth-session-probe — behavior-oracle slice

This slice bounds auth session probe to red-team.auth-session-probe. It uses `auth-session-probe-slice-behavior-oracle` and checks session_cases (nonempty): session cases must name the concrete repository contract..

Start from a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.red-team.auth-session-probe.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than auth session probe configuration validation only; declared policy does not prove running auth session probe behavior. Select an approved repository-owned command to verify that behavior.
