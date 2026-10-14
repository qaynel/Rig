# development.repo-hygiene.status-updates — behavior-oracle slice

This slice bounds status updates to repo-hygiene.status-updates. It uses `status-updates-slice-behavior-oracle` and checks completed (nonempty): completed must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.repo-hygiene.status-updates.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than status updates configuration validation only; declared policy does not prove running status updates behavior. Select an approved repository-owned command to verify that behavior.
