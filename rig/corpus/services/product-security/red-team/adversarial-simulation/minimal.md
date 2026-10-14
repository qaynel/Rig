# product-security.red-team.adversarial-simulation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for adversarial simulation. The minimal boundary for adversarial simulation checks attack_scenarios (nonempty): attack scenarios must name the concrete repository contract.. Binding checks: adversarial-simulation-source-code-boundary.

Use a repository-owned command or existing native check that can observe red-team.adversarial-simulation; bind it to the input named in `rig-services/product-security.red-team.adversarial-simulation.json` and preserve the check's failure status. When adopting this in an existing repository, connect adversarial simulation to the command that inspects attack_scenarios and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside red-team.adversarial-simulation as a failure.

Acceptance target: fixture:product-security.red-team.adversarial-simulation:policy-boundary. Given source-code is present and red-team.adversarial-simulation is selected, pass only when the repository binding evaluates red-team.adversarial-simulation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. The ceiling is adversarial simulation configuration validation only; declared policy does not prove running adversarial simulation behavior. Choose a repository-owned check that observes adversarial simulation from rig-services/product-security.red-team.adversarial-simulation.json..

Service-specific evidence cues:
Offer: Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.
minimal: attack scenarios — ["malformed token"].
mid: containment scope — "isolated test deployment".
maximal: use real customer data — false.
