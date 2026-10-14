# testing.unit.test-case-generation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for test case generation; it does not widen ownership beyond unit.test-case-generation. For test case generation, inspect these context signals: asserted_outcomes. Binding checks: test-case-generation-unit-context.

Tie acceptance to the existing repository's test case generation convention, then name the source path or command that establishes it. For test case generation, inspect the repository's actual spec, source, test, or configuration for asserted_outcomes; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring unit services outside the test case generation decision for unit.test-case-generation.

Acceptance target: fixture:testing.unit.test-case-generation:repository-context. Given unit.test-case-generation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent unit concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.
minimal: behavior cases — ["reject malformed input"].
mid: asserted outcomes — ["throws invalid record"].
maximal: assert implementation details — false.
