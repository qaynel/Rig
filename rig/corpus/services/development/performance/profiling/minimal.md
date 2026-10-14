# development.performance.profiling — minimal

Minimal establishes a non-vacuous policy boundary for profiling. It checks workload (nonempty): workload must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe code-profiling, bottleneck-identification; bind it to the input named in `rig-services/development.performance.profiling.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside code-profiling, bottleneck-identification is a failure.

Acceptance target: fixture:development.performance.profiling:policy-boundary. Given source-code is present and code-profiling is selected, pass only when the repository binding evaluates code-profiling and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance concern. A passing policy check does not establish runtime behavior.
