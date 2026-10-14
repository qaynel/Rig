# testing.mutation.survivor-rca — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for survivor rca; it does not widen ownership beyond mutation.survivor-rca. For survivor rca, inspect these context signals: missing_assertions. Binding checks: survivor-rca-mutation-context.

Anchor the review on the existing repository's survivor rca convention, then name the source path or command that establishes it. For survivor rca, inspect the repository's actual spec, source, test, or configuration for missing_assertions; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring mutation services outside the survivor rca decision for mutation.survivor-rca.

Acceptance target: fixture:testing.mutation.survivor-rca:repository-context. Given mutation.survivor-rca has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.
minimal: surviving mutants — ["boundary comparison changed"].
mid: missing assertions — ["exact limit rejected"].
maximal: ignore equivalence question — false.
