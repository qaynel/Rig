# testing.e2e.user-journeys — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for user journeys; it does not widen ownership beyond e2e.user-journeys. The context signals are observable_outcomes. Binding checks: user-journeys-e2e-context.

Anchor the review on the existing repository's user journeys convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in e2e under their own verdicts.

Acceptance target: fixture:testing.e2e.user-journeys:repository-context. Given e2e.user-journeys has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent e2e concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Owned scope: `e2e.user-journeys`.

Offer: Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Input: `rig-services/testing.e2e.user-journeys.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: user journeys configuration validation only; declared policy does not prove running user journeys behavior. Select an approved repository-owned command to verify that behavior.

minimal: journeys — ["create and retrieve item"].

mid: observable outcomes — ["item appears after refresh"].

maximal: assert only page loaded — false.
