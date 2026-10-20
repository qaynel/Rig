# Adversarial simulation

Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Run threat scenarios only in a contained, approved environment. Customer data and unapproved production targets are out of scope.

Owned scope: `red-team.adversarial-simulation`. Input: `rig-services/product-security.red-team.adversarial-simulation.json`.

The policy declares minimal `attack_scenarios` = ["malformed token"]; mid `containment_scope` = "isolated test deployment"; maximal `use_real_customer_data` = false. The native rules only check that attack_scenarios and containment_scope are nonempty and use_real_customer_data is false. They do not launch a simulation or verify containment.

Name scenarios that apply to this system and identify the exact isolated deployment and assets they may touch. A configured scope is not proof that the test runner is isolated. A runtime exercise requires approval for the named target and evidence that execution stayed within the declared isolated scope.

Keep real customer data out of experiments and treat an absent containment boundary as a stop condition.
