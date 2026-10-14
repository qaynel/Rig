# development.repo-hygiene.stale-cleanup — identity

stale cleanup owns repo-hygiene.stale-cleanup. Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Keep sibling services in repo-hygiene under their own verdicts. Tie acceptance to the configured input at `rig-services/development.repo-hygiene.stale-cleanup.json`; malformed input is still attributed to that path.

Disposition: convention. Read the limit: stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.repo-hygiene.stale-cleanup:policy-boundary. Given source-code is present and repo-hygiene.stale-cleanup is selected, pass only when the repository binding evaluates repo-hygiene.stale-cleanup and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern.
