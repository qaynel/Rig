# testing.mutation.ci-gate-policy — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for ci gate policy; it does not widen ownership beyond mutation.ci-gate-policy. For ci gate policy, inspect these context signals: timeout_policy. Binding checks: ci-gate-policy-mutation-context.

Use the existing repository's ci gate policy convention, then name the source path or command that establishes it. For ci gate policy, inspect the repository's actual spec, source, test, or configuration for timeout_policy; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring mutation services outside the ci gate policy decision for mutation.ci-gate-policy.

Acceptance target: fixture:testing.mutation.ci-gate-policy:repository-context. Given mutation.ci-gate-policy has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.
minimal: minimum score percent — 70.
mid: timeout policy — "fail-inconclusive".
maximal: allow unrun mutants — false.
