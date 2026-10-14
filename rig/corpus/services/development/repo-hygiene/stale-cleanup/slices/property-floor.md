# development.repo-hygiene.stale-cleanup — property-floor slice

Policy grade slice. This slice bounds stale cleanup to repo-hygiene.stale-cleanup. It uses `stale-cleanup-slice-property-floor` and checks candidate_paths (nonempty): candidate paths must name the concrete repository contract..

For stale cleanup, choose a repository example that satisfies candidate_paths at the property-floor floor, plus a failure where candidate paths must name the concrete repository contract. is false. For stale cleanup, wire `property-floor` to `rig-services/development.repo-hygiene.stale-cleanup.json` and keep its verdict on candidate_paths; missing evidence is a named gap, with ceiling stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Choose a repository-owned check that observes stale cleanup from rig-services/development.repo-hygiene.stale-cleanup.json..

Service-specific evidence cues:
Offer: Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.
minimal: candidate paths — ["unused/generated.js"].
mid: reference checks — ["search callers"].
maximal: delete without recovery — false.
