# development.code-quality.correctness-static — identity

Policy grade: correctness static owns correctness-static-analysis, complexity-static. Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

For correctness static, keep security-sast, sast outside its verdict. Use the configured input at `rig-services/development.code-quality.correctness-static.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: correctness static configuration validation only; declared policy does not prove running correctness static behavior. Choose a repository-owned check that observes correctness static from rig-services/development.code-quality.correctness-static.json.

Acceptance target: fixture:development.code-quality.correctness-static:policy-boundary. Given source-code is present and correctness-static-analysis is selected, pass only when the repository binding evaluates correctness-static-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims security-sast.

Service-specific evidence cues:
Offer: Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.
minimal: analyzer command — ["npm","run","analyze"].
mid: enabled rules — ["null-dereference"].
maximal: ignore analyzer failure — false.
