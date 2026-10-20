# development.debugging.root-cause-analysis — minimal

Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for root cause analysis. The minimal boundary for root cause analysis checks failure_boundary (nonempty): failure boundary must name the concrete repository contract. Binding checks: root-cause-analysis-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe debugging.root-cause-analysis; bind it to the input named in `rig-services/development.debugging.root-cause-analysis.json` and preserve the check's failure status. When adopting this in an existing repository, connect root cause analysis to the command that inspects failure_boundary and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside debugging.root-cause-analysis as a failure.

Acceptance target: policy:development.debugging.root-cause-analysis:minimal:root-cause-analysis-source-code-boundary.

Declared predicates: root-cause-analysis-source-code-boundary: `failure_boundary` is nonempty (a string or array).
