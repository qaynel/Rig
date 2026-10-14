# development.repo-hygiene.stale-cleanup — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for stale cleanup; it does not widen ownership beyond repo-hygiene.stale-cleanup. The context signals are reference_checks. Binding checks: stale-cleanup-repo-hygiene-context.

Use the existing repository's stale cleanup convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in repo-hygiene under their own verdicts.

Acceptance target: fixture:development.repo-hygiene.stale-cleanup:repository-context. Given repo-hygiene.stale-cleanup has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent repo hygiene concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Owned scope: `repo-hygiene.stale-cleanup`.

Offer: Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.

Input: `rig-services/development.repo-hygiene.stale-cleanup.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Select an approved repository-owned command to verify that behavior.

minimal: candidate paths — ["unused/generated.js"].

mid: reference checks — ["search callers"].

maximal: delete without recovery — false.
