# development.repo-hygiene.stale-cleanup — identity

Policy grade: stale cleanup owns repo-hygiene.stale-cleanup. Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Keep sibling services in repo-hygiene under their own verdicts. Tie acceptance to the configured input at `rig-services/development.repo-hygiene.stale-cleanup.json`; malformed input is still attributed to that path.

Disposition: convention. Read the limit: stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.repo-hygiene.stale-cleanup:policy-boundary. Given source-code is present and repo-hygiene.stale-cleanup is selected, pass only when the repository binding evaluates repo-hygiene.stale-cleanup and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern.

Service-specific evidence cues:
Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Owned scope: `repo-hygiene.stale-cleanup`.

Offer: Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Input: `rig-services/development.repo-hygiene.stale-cleanup.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Select an approved repository-owned command to verify that behavior.

minimal: candidate paths — ["unused/generated.js"].

mid: reference checks — ["search callers"].

maximal: delete without recovery — false.
