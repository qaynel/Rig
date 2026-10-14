# testing.e2e.browser-automation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for browser automation. The minimal boundary for browser automation checks browser_targets (nonempty): browser targets must name the concrete repository contract.. Binding checks: browser-automation-source-code-boundary.

Use a repository-owned command or existing native check that can observe e2e.browser-automation; bind it to the input named in `rig-services/testing.e2e.browser-automation.json` and preserve the check's failure status. When adopting this in an existing repository, connect browser automation to the command that inspects browser_targets and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside e2e.browser-automation as a failure.

Acceptance target: fixture:testing.e2e.browser-automation:policy-boundary. Given source-code is present and e2e.browser-automation is selected, pass only when the repository binding evaluates e2e.browser-automation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern. The ceiling is browser automation configuration validation only; declared policy does not prove running browser automation behavior. Choose a repository-owned check that observes browser automation from rig-services/testing.e2e.browser-automation.json..

Service-specific evidence cues:
Offer: Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.
minimal: browser targets — ["chromium"].
mid: interaction steps — ["submit form"].
maximal: fixed sleeps — false.
