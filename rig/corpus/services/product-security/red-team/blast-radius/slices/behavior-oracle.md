# product-security.red-team.blast-radius — behavior-oracle slice

This slice bounds blast radius to red-team.blast-radius. It uses `blast-radius-slice-behavior-oracle` and checks privilege_scopes (nonempty): privilege scopes must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.red-team.blast-radius.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than blast radius configuration validation only; declared policy does not prove running blast radius behavior. Select an approved repository-owned command to verify that behavior.
