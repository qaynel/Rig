# testing.test-data.fixtures-factories — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for fixtures factories; it does not widen ownership beyond test-data.fixtures-factories. The context signals are explicit_variants. Binding checks: fixtures-factories-test-data-context.

Trace the verdict to the existing repository's fixtures factories convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in test-data under their own verdicts.

Acceptance target: fixture:testing.test-data.fixtures-factories:repository-context. Given test-data.fixtures-factories has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent test data concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Owned scope: `test-data.fixtures-factories`.

Offer: Keep fixture defaults valid and make behavioral variants explicit. Shared mutable fixtures allow one test to change another test outcome and obscure the scenario being checked.

Input: `rig-services/testing.test-data.fixtures-factories.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: fixtures factories configuration validation only; declared policy does not prove running fixtures factories behavior. Select an approved repository-owned command to verify that behavior.

minimal: fixture defaults — ["valid account"].

mid: explicit variants — ["expired account"].

maximal: shared mutable state — false.
