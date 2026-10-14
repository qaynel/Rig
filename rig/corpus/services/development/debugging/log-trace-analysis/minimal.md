# development.debugging.log-trace-analysis — minimal

Minimal establishes a non-vacuous policy boundary for log trace analysis. It checks trace_fields (nonempty): trace fields must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe debugging.log-trace-analysis; bind it to the input named in `rig-services/development.debugging.log-trace-analysis.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside debugging.log-trace-analysis is a failure.

Acceptance target: fixture:development.debugging.log-trace-analysis:policy-boundary. Given source-code is present and debugging.log-trace-analysis is selected, pass only when the repository binding evaluates debugging.log-trace-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent debugging concern. A passing policy check does not establish runtime behavior.
