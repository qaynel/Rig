# testing.maintenance.readability-dry — minimal

Minimal establishes a non-vacuous policy boundary for readability dry. It checks scenario_names (nonempty): scenario names must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe maintenance.readability-dry; bind it to the input named in `rig-services/testing.maintenance.readability-dry.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside maintenance.readability-dry is a failure.

Acceptance target: fixture:testing.maintenance.readability-dry:policy-boundary. Given source-code is present and maintenance.readability-dry is selected, pass only when the repository binding evaluates maintenance.readability-dry and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern. A passing policy check does not establish runtime behavior.
