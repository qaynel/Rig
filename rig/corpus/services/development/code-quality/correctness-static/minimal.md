# development.code-quality.correctness-static — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for correctness static. It checks analyzer_command (nonempty): analyzer command must name the concrete repository contract.. Binding checks: correctness-static-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe correctness-static-analysis, complexity-static; bind it to the input named in `rig-services/development.code-quality.correctness-static.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside correctness-static-analysis, complexity-static is a failure.

Acceptance target: fixture:development.code-quality.correctness-static:policy-boundary. Given source-code is present and correctness-static-analysis is selected, pass only when the repository binding evaluates correctness-static-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims security-sast. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Owned scope: `correctness-static-analysis`, `complexity-static`.

Offer: Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Input: `rig-services/development.code-quality.correctness-static.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: correctness static configuration validation only; declared policy does not prove running correctness static behavior. Select an approved repository-owned command to verify that behavior.

minimal: analyzer command — ["npm","run","analyze"].

mid: enabled rules — ["null-dereference"].

maximal: ignore analyzer failure — false.
