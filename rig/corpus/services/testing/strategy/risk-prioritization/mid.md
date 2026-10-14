# testing.strategy.risk-prioritization — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for risk prioritization; it does not widen ownership beyond strategy.risk-prioritization. The context signals are impact_scores. Binding checks: test-priority-ranking-strategy-context.

Anchor the review on the existing repository's risk prioritization convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in strategy under their own verdicts.

Acceptance target: fixture:testing.strategy.risk-prioritization:repository-context. Given strategy.risk-prioritization has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent strategy concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Owned scope: `strategy.risk-prioritization`.

Offer: Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Input: `rig-services/testing.strategy.risk-prioritization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Select an approved repository-owned command to verify that behavior.

minimal: high risk behaviors — ["payment duplication"].

mid: impact scores — [5].

maximal: prioritize only easy cases — false.
