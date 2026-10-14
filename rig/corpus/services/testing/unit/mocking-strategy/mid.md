# testing.unit.mocking-strategy — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for mocking strategy; it does not widen ownership beyond unit.mocking-strategy. For mocking strategy, inspect these context signals: real_components. Binding checks: mocking-strategy-unit-context.

Anchor the review on the existing repository's mocking strategy convention, then name the source path or command that establishes it. For mocking strategy, inspect the repository's actual spec, source, test, or configuration for real_components; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring unit services outside the mocking strategy decision for unit.mocking-strategy.

Acceptance target: fixture:testing.unit.mocking-strategy:repository-context. Given unit.mocking-strategy has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent unit concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.
minimal: mocked boundaries — ["payment network"].
mid: real components — ["order service"].
maximal: mock unit under test — false.
