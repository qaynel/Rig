# development.code-quality.correctness-static — minimal

Minimal establishes a non-vacuous policy boundary for correctness static. It checks analyzer_command (nonempty): analyzer command must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe correctness-static-analysis, complexity-static; bind it to the input named in `rig-services/development.code-quality.correctness-static.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside correctness-static-analysis, complexity-static is a failure.

Acceptance target: fixture:development.code-quality.correctness-static:policy-boundary. Given source-code is present and correctness-static-analysis is selected, pass only when the repository binding evaluates correctness-static-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims security-sast. A passing policy check does not establish runtime behavior.
