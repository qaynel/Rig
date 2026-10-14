# testing.strategy.risk-prioritization — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for risk prioritization; it does not widen ownership beyond strategy.risk-prioritization. For risk prioritization, inspect these context signals: impact_scores. Binding checks: test-priority-ranking-strategy-context.

Anchor the review on the existing repository's risk prioritization convention, then name the source path or command that establishes it. For risk prioritization, inspect the repository's actual spec, source, test, or configuration for impact_scores; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring strategy services outside the risk prioritization decision for strategy.risk-prioritization.

Acceptance target: fixture:testing.strategy.risk-prioritization:repository-context. Given strategy.risk-prioritization has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent strategy concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.
minimal: high risk behaviors — ["payment duplication"].
mid: impact scores — [5].
maximal: prioritize only easy cases — false.
