# testing.mutation.score-metrics — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for score metrics; it does not widen ownership beyond mutation.score-metrics. The context signals are valid_mutants. Binding checks: score-metrics-mutation-context.

Read the existing repository's score metrics convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.score-metrics:repository-context. Given mutation.score-metrics has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Owned scope: `mutation.score-metrics`.

Offer: Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Input: `rig-services/testing.mutation.score-metrics.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.

minimal: killed mutants — 8.

mid: valid mutants — 10.

maximal: include invalid mutants in score — false.
