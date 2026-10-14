# development.debugging.root-cause-analysis — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for root cause analysis. The minimal boundary for root cause analysis checks failure_boundary (nonempty): failure boundary must name the concrete repository contract.. Binding checks: root-cause-analysis-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe debugging.root-cause-analysis; bind it to the input named in `rig-services/development.debugging.root-cause-analysis.json` and preserve the check's failure status. When adopting this in an existing repository, connect root cause analysis to the command that inspects failure_boundary and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside debugging.root-cause-analysis as a failure.

Acceptance target: fixture:development.debugging.root-cause-analysis:policy-boundary. Given source-code is present and debugging.root-cause-analysis is selected, pass only when the repository binding evaluates debugging.root-cause-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent debugging concern. The ceiling is root cause analysis configuration validation only; declared policy does not prove running root cause analysis behavior. Choose a repository-owned check that observes root cause analysis from rig-services/development.debugging.root-cause-analysis.json..

Service-specific evidence cues:
Offer: Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.
minimal: failure boundary — "parser rejects malformed record".
mid: causal evidence — ["repro case fails at parser"].
maximal: symptom only fix — false.
