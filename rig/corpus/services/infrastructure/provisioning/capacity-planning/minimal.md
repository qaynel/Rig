# infrastructure.provisioning.capacity-planning — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for capacity planning. The minimal boundary for capacity planning checks peak_requests_per_second (minimum 100): peak requests per second must meet the configured minimum of 100.. Binding checks: capacity-planning-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe provisioning.capacity-planning; bind it to the input named in `rig-services/infrastructure.provisioning.capacity-planning.json` and preserve the check's failure status. When adopting this in an existing repository, connect capacity planning to the command that inspects peak_requests_per_second and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside provisioning.capacity-planning as a failure.

Acceptance target: fixture:infrastructure.provisioning.capacity-planning:policy-boundary. Given source-code is present and provisioning.capacity-planning is selected, pass only when the repository binding evaluates provisioning.capacity-planning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern. The ceiling is capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Choose a repository-owned check that observes capacity planning from rig-services/infrastructure.provisioning.capacity-planning.json..

Service-specific evidence cues:
Offer: Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.
minimal: peak requests per second — 100.
mid: headroom percent — 30.
maximal: ignore growth forecast — false.
