# testing.mutation.mutant-generator — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for mutant generator; it does not widen ownership beyond mutation.mutant-generator. The context signals are target_paths. Binding checks: mutant-generator-mutation-context.

Anchor the review on the existing repository's mutant generator convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.mutant-generator:repository-context. Given mutation.mutant-generator has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Owned scope: `mutation.mutant-generator`.

Offer: Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Input: `rig-services/testing.mutation.mutant-generator.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Select an approved repository-owned command to verify that behavior.

minimal: mutation operators — ["negate conditional"].

mid: target paths — ["src/parser.js"].

maximal: mutate test code — false.
