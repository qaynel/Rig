# development.repo-hygiene.stale-cleanup — behavior-oracle slice

This slice bounds stale cleanup to repo-hygiene.stale-cleanup. It uses `stale-cleanup-slice-behavior-oracle` and checks candidate_paths (nonempty): candidate paths must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.repo-hygiene.stale-cleanup.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Select an approved repository-owned command to verify that behavior.
