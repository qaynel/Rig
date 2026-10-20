# stale cleanup

Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Owned scope: `repo-hygiene.stale-cleanup`.

Offer: Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Input: `rig-services/development.repo-hygiene.stale-cleanup.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Select an approved repository-owned command to verify that behavior.

minimal: candidate paths — ["unused/generated.js"].

mid: reference checks — ["search callers"].

maximal: delete without recovery — false.
