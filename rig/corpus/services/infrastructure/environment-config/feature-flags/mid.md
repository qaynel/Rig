# infrastructure.environment-config.feature-flags — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for feature flags; it does not widen ownership beyond environment-config.feature-flags. The context signals are rollback_owner. Binding checks: feature-flags-environment-config-context.

Inspect the existing repository's feature flags convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in environment-config under their own verdicts.

Acceptance target: fixture:infrastructure.environment-config.feature-flags:repository-context. Given environment-config.feature-flags has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent environment config concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Owned scope: `environment-config.feature-flags`.

Offer: Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Input: `rig-services/infrastructure.environment-config.feature-flags.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: feature flags configuration validation only; declared policy does not prove running feature flags behavior. Select an approved repository-owned command to verify that behavior.

minimal: flag names — ["new_checkout"].

mid: rollback owner — "checkout team".

maximal: permanent unowned flags — false.
