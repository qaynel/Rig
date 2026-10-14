# product-security.red-team.adversarial-simulation — minimal

Minimal establishes a non-vacuous policy boundary for adversarial simulation. It checks attack_scenarios (nonempty): attack scenarios must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe red-team.adversarial-simulation; bind it to the input named in `rig-services/product-security.red-team.adversarial-simulation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside red-team.adversarial-simulation is a failure.

Acceptance target: fixture:product-security.red-team.adversarial-simulation:policy-boundary. Given source-code is present and red-team.adversarial-simulation is selected, pass only when the repository binding evaluates red-team.adversarial-simulation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. A passing policy check does not establish runtime behavior.
