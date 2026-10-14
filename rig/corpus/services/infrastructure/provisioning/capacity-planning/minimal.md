# infrastructure.provisioning.capacity-planning — minimal

Minimal establishes a non-vacuous policy boundary for capacity planning. It checks peak_requests_per_second (minimum 100): peak requests per second must meet the configured minimum of 100..

Trace the verdict to a repository-owned command or existing native check that can observe provisioning.capacity-planning; bind it to the input named in `rig-services/infrastructure.provisioning.capacity-planning.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside provisioning.capacity-planning is a failure.

Acceptance target: fixture:infrastructure.provisioning.capacity-planning:policy-boundary. Given source-code is present and provisioning.capacity-planning is selected, pass only when the repository binding evaluates provisioning.capacity-planning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern. A passing policy check does not establish runtime behavior.
