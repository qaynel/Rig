# development.documentation.adrs — identity

adrs owns documentation.adrs. Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Keep sibling services in documentation under their own verdicts. Anchor the review on the configured input at `rig-services/development.documentation.adrs.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: adrs configuration validation only; declared policy does not prove running adrs behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.documentation.adrs:policy-boundary. Given source-code is present and documentation.adrs is selected, pass only when the repository binding evaluates documentation.adrs and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern.
