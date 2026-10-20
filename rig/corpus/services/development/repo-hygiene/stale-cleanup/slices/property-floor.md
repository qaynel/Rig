# development.repo-hygiene.stale-cleanup — property-floor slice

Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Policy grade slice. This slice bounds stale cleanup to repo-hygiene.stale-cleanup. It uses `stale-cleanup-slice-property-floor` and checks candidate_paths (nonempty): candidate paths must name the concrete repository contract.