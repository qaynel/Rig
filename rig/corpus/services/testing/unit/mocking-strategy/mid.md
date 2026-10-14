# testing.unit.mocking-strategy — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for mocking strategy; it does not widen ownership beyond unit.mocking-strategy. The context signals are real_components. Binding checks: mocking-strategy-unit-context.

Anchor the review on the existing repository's mocking strategy convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in unit under their own verdicts.

Acceptance target: fixture:testing.unit.mocking-strategy:repository-context. Given unit.mocking-strategy has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent unit concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Owned scope: `unit.mocking-strategy`.

Offer: Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Input: `rig-services/testing.unit.mocking-strategy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Select an approved repository-owned command to verify that behavior.

minimal: mocked boundaries — ["payment network"].

mid: real components — ["order service"].

maximal: mock unit under test — false.
