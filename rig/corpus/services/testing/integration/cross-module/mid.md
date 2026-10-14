# testing.integration.cross-module — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for cross module; it does not widen ownership beyond integration.cross-module. The context signals are interaction_cases. Binding checks: cross-module-integration-context.

Ground the decision in the existing repository's cross module convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in integration under their own verdicts.

Acceptance target: fixture:testing.integration.cross-module:repository-context. Given integration.cross-module has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent integration concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Owned scope: `integration.cross-module`.

Offer: Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Input: `rig-services/testing.integration.cross-module.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: cross module configuration validation only; declared policy does not prove running cross module behavior. Select an approved repository-owned command to verify that behavior.

minimal: participating modules — ["orders","inventory"].

mid: interaction cases — ["order reserves stock"].

maximal: stub internal contracts — false.
