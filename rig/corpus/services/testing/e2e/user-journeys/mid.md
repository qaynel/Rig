# testing.e2e.user-journeys — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for user journeys; it does not widen ownership beyond e2e.user-journeys. For user journeys, inspect these context signals: observable_outcomes. Binding checks: user-journeys-e2e-context.

Anchor the review on the existing repository's user journeys convention, then name the source path or command that establishes it. For user journeys, inspect the repository's actual spec, source, test, or configuration for observable_outcomes; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring e2e services outside the user journeys decision for e2e.user-journeys.

Acceptance target: fixture:testing.e2e.user-journeys:repository-context. Given e2e.user-journeys has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent e2e concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.
minimal: journeys — ["create and retrieve item"].
mid: observable outcomes — ["item appears after refresh"].
maximal: assert only page loaded — false.
