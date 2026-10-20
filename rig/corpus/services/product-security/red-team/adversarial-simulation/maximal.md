# product-security.red-team.adversarial-simulation — maximal

Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: adversarial-simulation-source-code-boundary, adversarial-simulation-red-team-context, adversarial-simulation-evidence-receipt.

The native rules only check that attack_scenarios and containment_scope are nonempty and use_real_customer_data is false. They do not launch a simulation or verify containment. A runtime exercise requires approval for the named target and evidence that execution stayed within the declared isolated scope.

Catalogue policy target: `policy:product-security.red-team.adversarial-simulation:maximal:adversarial-simulation-source-code-boundary+adversarial-simulation-red-team-context+adversarial-simulation-evidence-receipt`. Its current rule proves only that use_real_customer_data equals false. It does not run or replay a red-team test.
