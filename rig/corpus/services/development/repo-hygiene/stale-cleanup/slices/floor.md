# development.repo-hygiene.stale-cleanup — floor and mutation-floor slice

Policy grade slice. This slice bounds stale cleanup to repo-hygiene.stale-cleanup. It uses `stale-cleanup-slice-floor` and checks candidate_paths (nonempty): candidate paths must name the concrete repository contract..

Inspect a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.repo-hygiene.stale-cleanup.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Owned scope: `repo-hygiene.stale-cleanup`.

Offer: Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Input: `rig-services/development.repo-hygiene.stale-cleanup.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Select an approved repository-owned command to verify that behavior.

minimal: candidate paths — ["unused/generated.js"].

mid: reference checks — ["search callers"].

maximal: delete without recovery — false.
