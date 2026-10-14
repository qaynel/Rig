# testing.mutation.mutant-generator — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for mutant generator; it does not widen ownership beyond mutation.mutant-generator. For mutant generator, inspect these context signals: target_paths. Binding checks: mutant-generator-mutation-context.

Anchor the review on the existing repository's mutant generator convention, then name the source path or command that establishes it. For mutant generator, inspect the repository's actual spec, source, test, or configuration for target_paths; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring mutation services outside the mutant generator decision for mutation.mutant-generator.

Acceptance target: fixture:testing.mutation.mutant-generator:repository-context. Given mutation.mutant-generator has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.
minimal: mutation operators — ["negate conditional"].
mid: target paths — ["src/parser.js"].
maximal: mutate test code — false.
