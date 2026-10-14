# development.repo-hygiene.issue-pr-triage — property-floor slice

Policy grade slice. This slice bounds issue pr triage to repo-hygiene.issue-pr-triage. It uses `issue-pr-triage-slice-property-floor` and checks triage_labels (nonempty): triage labels must name the concrete repository contract..

Inspect a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.repo-hygiene.issue-pr-triage.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than issue pr triage configuration validation only; declared policy does not prove running issue pr triage behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Owned scope: `repo-hygiene.issue-pr-triage`.

Offer: Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Input: `rig-services/development.repo-hygiene.issue-pr-triage.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: issue pr triage configuration validation only; declared policy does not prove running issue pr triage behavior. Select an approved repository-owned command to verify that behavior.

minimal: triage labels — ["bug","needs-reproduction"].

mid: responsible owners — ["maintainers"].

maximal: close without disposition — false.
