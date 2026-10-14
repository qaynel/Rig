# infrastructure.networking.dns-discovery — minimal

Minimal establishes a non-vacuous policy boundary for dns discovery. It checks service_records (nonempty): service records must name the concrete repository contract..

Inspect a repository-owned command or existing native check that can observe networking.dns-discovery; bind it to the input named in `rig-services/infrastructure.networking.dns-discovery.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside networking.dns-discovery is a failure.

Acceptance target: fixture:infrastructure.networking.dns-discovery:policy-boundary. Given source-code is present and networking.dns-discovery is selected, pass only when the repository binding evaluates networking.dns-discovery and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern. A passing policy check does not establish runtime behavior.
