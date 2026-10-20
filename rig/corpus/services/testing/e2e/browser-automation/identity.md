# testing.e2e.browser-automation — identity

Policy grade: browser-automation owns e2e.browser-automation. Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Input: `rig-services/testing.e2e.browser-automation.json`. Configuration validation only, so it confirms browser targets, interaction steps and the fixed-sleep flag are declared; it does not drive a browser.

Disposition: executable.
Acceptance target: policy:testing.e2e.browser-automation:minimal:browser-automation-source-code-boundary.
Declared predicates: browser-automation-source-code-boundary: `browser_targets` is nonempty (a string or array).
