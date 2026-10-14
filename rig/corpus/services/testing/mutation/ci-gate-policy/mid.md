# testing.mutation.ci-gate-policy — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for ci gate policy; it does not widen ownership beyond mutation.ci-gate-policy. The context signals are timeout_policy. Binding checks: ci-gate-policy-mutation-context.

Use the existing repository's ci gate policy convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.ci-gate-policy:repository-context. Given mutation.ci-gate-policy has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Owned scope: `mutation.ci-gate-policy`.

Offer: Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Input: `rig-services/testing.mutation.ci-gate-policy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Select an approved repository-owned command to verify that behavior.

minimal: minimum score percent — 70.

mid: timeout policy — "fail-inconclusive".

maximal: allow unrun mutants — false.
