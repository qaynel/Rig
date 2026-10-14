# development.repo-hygiene.stale-cleanup — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for stale cleanup. It checks candidate_paths (nonempty): candidate paths must name the concrete repository contract.. Binding checks: stale-cleanup-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe repo-hygiene.stale-cleanup; bind it to the input named in `rig-services/development.repo-hygiene.stale-cleanup.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside repo-hygiene.stale-cleanup is a failure.

Acceptance target: fixture:development.repo-hygiene.stale-cleanup:policy-boundary. Given source-code is present and repo-hygiene.stale-cleanup is selected, pass only when the repository binding evaluates repo-hygiene.stale-cleanup and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Owned scope: `repo-hygiene.stale-cleanup`.

Offer: Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Input: `rig-services/development.repo-hygiene.stale-cleanup.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Select an approved repository-owned command to verify that behavior.

minimal: candidate paths — ["unused/generated.js"].

mid: reference checks — ["search callers"].

maximal: delete without recovery — false.
