# development.repo-hygiene.issue-pr-triage — behavior-oracle slice

This slice bounds issue pr triage to repo-hygiene.issue-pr-triage. It uses `issue-pr-triage-slice-behavior-oracle` and checks triage_labels (nonempty): triage labels must name the concrete repository contract..

Inspect a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.repo-hygiene.issue-pr-triage.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than issue pr triage configuration validation only; declared policy does not prove running issue pr triage behavior. Select an approved repository-owned command to verify that behavior.
