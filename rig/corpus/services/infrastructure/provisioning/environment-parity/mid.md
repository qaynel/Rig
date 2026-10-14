# infrastructure.provisioning.environment-parity — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for environment parity; it does not widen ownership beyond provisioning.environment-parity. The context signals are intentional_differences. Binding checks: environment-parity-provisioning-context.

Anchor the review on the existing repository's environment parity convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in provisioning under their own verdicts.

Acceptance target: fixture:infrastructure.provisioning.environment-parity:repository-context. Given provisioning.environment-parity has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent provisioning concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Owned scope: `provisioning.environment-parity`.

Offer: Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Input: `rig-services/infrastructure.provisioning.environment-parity.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: environment parity configuration validation only; declared policy does not prove running environment parity behavior. Select an approved repository-owned command to verify that behavior.

minimal: environments — ["staging","production"].

mid: intentional differences — ["instance count"].

maximal: unrecorded differences allowed — false.
