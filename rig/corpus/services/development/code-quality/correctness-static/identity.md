# development.code-quality.correctness-static — identity

Policy grade: correctness static owns correctness-static-analysis, complexity-static. Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

For correctness static, keep security-sast, sast outside its verdict. Use the configured input at `rig-services/development.code-quality.correctness-static.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: correctness static configuration validation only; declared policy does not prove running correctness static behavior. Choose a repository-owned check that observes correctness static from rig-services/development.code-quality.correctness-static.json.

Acceptance target: policy:development.code-quality.correctness-static:minimal:correctness-static-source-code-boundary.

Declared predicates: correctness-static-source-code-boundary: `analyzer_command` is nonempty (a string or array).
