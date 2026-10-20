# product-security.red-team.adversarial-simulation — minimal

Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Grade: minimal. Assurance remains Policy grade. `adversarial-simulation-source-code-boundary` checks that `attack_scenarios` is nonempty. Example: ["malformed token"].

Name scenarios that apply to this system and identify the exact isolated deployment and assets they may touch. A configured scope is not proof that the test runner is isolated. The rule proves only that a value was configured.

Catalogue policy target: `policy:product-security.red-team.adversarial-simulation:minimal:adversarial-simulation-source-code-boundary`. This names the policy condition; no runnable attack fixture is included here.
