# testing.test-data.fixtures-factories — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for fixtures factories; it does not widen ownership beyond test-data.fixtures-factories. For fixtures factories, inspect these context signals: explicit_variants. Binding checks: fixtures-factories-test-data-context.

Trace the verdict to the existing repository's fixtures factories convention, then name the source path or command that establishes it. For fixtures factories, inspect the repository's actual spec, source, test, or configuration for explicit_variants; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring test-data services outside the fixtures factories decision for test-data.fixtures-factories.

Acceptance target: fixture:testing.test-data.fixtures-factories:repository-context. Given test-data.fixtures-factories has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent test data concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.
minimal: fixture defaults — ["valid account"].
mid: explicit variants — ["expired account"].
maximal: shared mutable state — false.
