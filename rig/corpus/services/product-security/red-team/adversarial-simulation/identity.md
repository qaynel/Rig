# product-security.red-team.adversarial-simulation — identity

Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Policy grade. Run threat scenarios only in a contained, approved environment. Customer data and unapproved production targets are out of scope.

Applicable surface: source-code. Owned scope: `red-team.adversarial-simulation`. Input: `rig-services/product-security.red-team.adversarial-simulation.json`.

Disposition: executable. The native checks validate policy configuration only; they do not demonstrate the promised red-team behavior.

The native rules only check that attack_scenarios and containment_scope are nonempty and use_real_customer_data is false. They do not launch a simulation or verify containment.

Configured examples: minimal `attack_scenarios` = ["malformed token"]; mid `containment_scope` = "isolated test deployment"; maximal `use_real_customer_data` = false. These are policy values, not results from an attack simulation or runtime probe.
