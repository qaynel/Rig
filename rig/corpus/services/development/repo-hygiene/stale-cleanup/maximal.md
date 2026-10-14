# development.repo-hygiene.stale-cleanup — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for stale cleanup. The evidence must preserve the candidate_paths, reference_checks, delete_without_recovery inputs that determined the result. Binding checks: stale-cleanup-evidence-receipt.

Start from a second run against unchanged stale cleanup inputs. Record the candidate_paths, reference_checks, delete_without_recovery inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this stale cleanup result is stale. The ceiling remains: stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Choose a repository-owned check that observes stale cleanup from rig-services/development.repo-hygiene.stale-cleanup.json.

Acceptance target: fixture:development.repo-hygiene.stale-cleanup:evidence-replay. Given the repo-hygiene.stale-cleanup binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Establish that a stale candidate has no remaining callers before removing it. Retain a recoverable deletion and preserve user-owned files that only look unused.
minimal: candidate paths — ["unused/generated.js"].
mid: reference checks — ["search callers"].
maximal: delete without recovery — false.
