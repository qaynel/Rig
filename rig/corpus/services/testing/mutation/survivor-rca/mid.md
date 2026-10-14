# testing.mutation.survivor-rca — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for survivor rca; it does not widen ownership beyond mutation.survivor-rca. The context signals are missing_assertions. Binding checks: survivor-rca-mutation-context.

Anchor the review on the existing repository's survivor rca convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.survivor-rca:repository-context. Given mutation.survivor-rca has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Owned scope: `mutation.survivor-rca`.

Offer: Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Input: `rig-services/testing.mutation.survivor-rca.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: survivor rca configuration validation only; declared policy does not prove running survivor rca behavior. Select an approved repository-owned command to verify that behavior.

minimal: surviving mutants — ["boundary comparison changed"].

mid: missing assertions — ["exact limit rejected"].

maximal: ignore equivalence question — false.
