# development.code-quality.correctness-static — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for correctness static; it does not widen ownership beyond correctness-static-analysis, complexity-static. The context signals are enabled_rules. Binding checks: correctness-static-code-quality-context.

Anchor the review on the existing repository's correctness static convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep security-sast, sast outside this verdict.

Acceptance target: fixture:development.code-quality.correctness-static:repository-context. Given correctness-static-analysis has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes security-sast; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Owned scope: `correctness-static-analysis`, `complexity-static`.

Offer: Choose correctness rules for the language and record the actual analyzer invocation. Analyzer crashes and findings remain non-passing; a missing analyzer is a setup gap.

Input: `rig-services/development.code-quality.correctness-static.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: correctness static configuration validation only; declared policy does not prove running correctness static behavior. Select an approved repository-owned command to verify that behavior.

minimal: analyzer command — ["npm","run","analyze"].

mid: enabled rules — ["null-dereference"].

maximal: ignore analyzer failure — false.
