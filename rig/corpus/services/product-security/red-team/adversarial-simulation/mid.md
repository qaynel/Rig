# product-security.red-team.adversarial-simulation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for adversarial simulation; it does not widen ownership beyond red-team.adversarial-simulation. For adversarial simulation, inspect these context signals: containment_scope. Binding checks: adversarial-simulation-red-team-context.

Start from the existing repository's adversarial simulation convention, then name the source path or command that establishes it. For adversarial simulation, inspect the repository's actual spec, source, test, or configuration for containment_scope; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring red-team services outside the adversarial simulation decision for red-team.adversarial-simulation.

Acceptance target: fixture:product-security.red-team.adversarial-simulation:repository-context. Given red-team.adversarial-simulation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent red team concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.
minimal: attack scenarios — ["malformed token"].
mid: containment scope — "isolated test deployment".
maximal: use real customer data — false.
