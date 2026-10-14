# development.repo-hygiene.stale-cleanup — maximal

Maximal adds a replayable evidence receipt for stale cleanup. The evidence must preserve the candidate_paths, reference_checks, delete_without_recovery inputs that determined the result.

Start from a second run against unchanged stale cleanup inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: stale cleanup configuration validation only; declared policy does not prove running stale cleanup behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.repo-hygiene.stale-cleanup:evidence-replay. Given the repo-hygiene.stale-cleanup binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
