# product-security.red-team.adversarial-simulation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for adversarial simulation; it does not widen ownership beyond red-team.adversarial-simulation. The context signals are containment_scope. Binding checks: adversarial-simulation-red-team-context.

Start from the existing repository's adversarial simulation convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in red-team under their own verdicts.

Acceptance target: fixture:product-security.red-team.adversarial-simulation:repository-context. Given red-team.adversarial-simulation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent red team concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Owned scope: `red-team.adversarial-simulation`.

Offer: Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Input: `rig-services/product-security.red-team.adversarial-simulation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: adversarial simulation configuration validation only; declared policy does not prove running adversarial simulation behavior. Select an approved repository-owned command to verify that behavior.

minimal: attack scenarios — ["malformed token"].

mid: containment scope — "isolated test deployment".

maximal: use real customer data — false.
