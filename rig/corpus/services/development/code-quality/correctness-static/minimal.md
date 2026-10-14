# development.code-quality.correctness-static — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for correctness static. The minimal boundary for correctness static checks analyzer_command (nonempty): analyzer command must name the concrete repository contract.. Binding checks: correctness-static-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe correctness-static-analysis, complexity-static; bind it to the input named in `rig-services/development.code-quality.correctness-static.json` and preserve the check's failure status. When adopting this in an existing repository, connect correctness static to the command that inspects analyzer_command and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside correctness-static-analysis, complexity-static as a failure.

Acceptance target: fixture:development.code-quality.correctness-static:policy-boundary. Given source-code is present and correctness-static-analysis is selected, pass only when the repository binding evaluates correctness-static-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims security-sast. The ceiling is correctness static configuration validation only; declared policy does not prove running correctness static behavior. Choose a repository-owned check that observes correctness static from rig-services/development.code-quality.correctness-static.json..

Service-specific evidence cues:
Offer: Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.
minimal: analyzer command — ["npm","run","analyze"].
mid: enabled rules — ["null-dereference"].
maximal: ignore analyzer failure — false.
