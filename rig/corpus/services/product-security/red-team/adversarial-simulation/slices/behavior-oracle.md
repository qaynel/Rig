# product-security.red-team.adversarial-simulation — behavior-oracle slice

Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Policy grade. This check’s name is `adversarial-simulation-slice-behavior-oracle`, but its rule only checks that `attack_scenarios` is nonempty. It does not start an experiment or observe its outcome.,Before an actual exercise, confirm the target is approved and isolated, and use no real customer data.The native check is `adversarial-simulation-slice-behavior-oracle`.

Before an actual exercise, confirm the target is approved and isolated, and use no real customer data.
