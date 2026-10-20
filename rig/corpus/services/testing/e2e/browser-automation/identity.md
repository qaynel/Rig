# testing.e2e.browser-automation — identity

Policy grade: browser automation owns e2e.browser-automation. Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Keep neighboring e2e services outside the browser automation decision for e2e.browser-automation. Read the configured input at `rig-services/testing.e2e.browser-automation.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: browser automation configuration validation only; declared policy does not prove running browser automation behavior. Choose a repository-owned check that observes browser automation from rig-services/testing.e2e.browser-automation.json.

Acceptance target: policy:testing.e2e.browser-automation:minimal:browser-automation-source-code-boundary.

Declared predicates: browser-automation-source-code-boundary: `browser_targets` is nonempty (a string or array).
