# survivor rca

Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Owned scope: `mutation.survivor-rca`.

Offer: Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Input: `rig-services/testing.mutation.survivor-rca.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: survivor rca configuration validation only; declared policy does not prove running survivor rca behavior. Select an approved repository-owned command to verify that behavior.

minimal: surviving mutants — ["boundary comparison changed"].

mid: missing assertions — ["exact limit rejected"].

maximal: ignore equivalence question — false.

