# testing.e2e.browser-automation — identity

browser automation owns e2e.browser-automation. Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Keep sibling services in e2e under their own verdicts. Read the configured input at `rig-services/testing.e2e.browser-automation.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: browser automation configuration validation only; declared policy does not prove running browser automation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.e2e.browser-automation:policy-boundary. Given source-code is present and e2e.browser-automation is selected, pass only when the repository binding evaluates e2e.browser-automation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern.
