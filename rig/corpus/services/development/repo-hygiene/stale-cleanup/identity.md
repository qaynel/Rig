# development.repo-hygiene.stale-cleanup — identity

Policy grade: stale cleanup owns repo-hygiene.stale-cleanup. Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Keep neighboring repo-hygiene services outside the stale cleanup decision for repo-hygiene.stale-cleanup. Tie acceptance to the configured input at `rig-services/development.repo-hygiene.stale-cleanup.json`; malformed input is still attributed to that path.

Disposition: convention. Read the limit: stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Choose a repository-owned check that observes stale cleanup from rig-services/development.repo-hygiene.stale-cleanup.json.

Acceptance target: fixture:development.repo-hygiene.stale-cleanup:policy-boundary. Given source-code is present and repo-hygiene.stale-cleanup is selected, pass only when the repository binding evaluates repo-hygiene.stale-cleanup and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern.

Service-specific evidence cues:
Offer: Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.
minimal: candidate paths — ["unused/generated.js"].
mid: reference checks — ["search callers"].
maximal: delete without recovery — false.
