# development.repo-hygiene.stale-cleanup — property-floor slice

Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Policy grade slice `stale-cleanup-slice-property-floor`: List the stale candidates by path. Without paths nothing identifies what will be removed, so name each file or directory.
