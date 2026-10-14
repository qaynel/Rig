# testing.strategy.risk-prioritization — mid

Mid adds repository context for risk prioritization; it does not widen ownership beyond strategy.risk-prioritization. The context signals are impact_scores.

Anchor the review on the existing repository's risk prioritization convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in strategy under their own verdicts.

Acceptance target: fixture:testing.strategy.risk-prioritization:repository-context. Given strategy.risk-prioritization has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent strategy concern; fail when the result infers local convention without an inspectable source.
