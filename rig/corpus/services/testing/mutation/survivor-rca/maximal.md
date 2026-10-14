# testing.mutation.survivor-rca — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for survivor rca. The evidence must preserve the surviving_mutants, missing_assertions, ignore_equivalence_question inputs that determined the result. Binding checks: survivor-rca-evidence-receipt.

Inspect a second run against unchanged survivor rca inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: survivor rca configuration validation only; declared policy does not prove running survivor rca behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.survivor-rca:evidence-replay. Given the mutation.survivor-rca binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Owned scope: `mutation.survivor-rca`.

Offer: Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Input: `rig-services/testing.mutation.survivor-rca.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: survivor rca configuration validation only; declared policy does not prove running survivor rca behavior. Select an approved repository-owned command to verify that behavior.

minimal: surviving mutants — ["boundary comparison changed"].

mid: missing assertions — ["exact limit rejected"].

maximal: ignore equivalence question — false.
