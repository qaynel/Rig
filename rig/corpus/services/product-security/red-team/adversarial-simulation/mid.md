# product-security.red-team.adversarial-simulation — mid

Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: adversarial-simulation-source-code-boundary, adversarial-simulation-red-team-context.

Name scenarios that apply to this system and identify the exact isolated deployment and assets they may touch. A configured scope is not proof that the test runner is isolated. No repository-specific evidence source is supplied by this policy definition, and a nonempty value does not prove that the local boundary has been inspected.

Catalogue policy target: `policy:product-security.red-team.adversarial-simulation:mid:adversarial-simulation-source-code-boundary+adversarial-simulation-red-team-context`. The native rule establishes only that containment_scope is nonempty.
