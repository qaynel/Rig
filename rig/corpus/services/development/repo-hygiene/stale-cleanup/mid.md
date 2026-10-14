# development.repo-hygiene.stale-cleanup — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for stale cleanup; it does not widen ownership beyond repo-hygiene.stale-cleanup. For stale cleanup, inspect these context signals: reference_checks. Binding checks: stale-cleanup-repo-hygiene-context.

Use the existing repository's stale cleanup convention, then name the source path or command that establishes it. For stale cleanup, inspect the repository's actual spec, source, test, or configuration for reference_checks; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring repo-hygiene services outside the stale cleanup decision for repo-hygiene.stale-cleanup.

Acceptance target: fixture:development.repo-hygiene.stale-cleanup:repository-context. Given repo-hygiene.stale-cleanup has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent repo hygiene concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.
minimal: candidate paths — ["unused/generated.js"].
mid: reference checks — ["search callers"].
maximal: delete without recovery — false.
