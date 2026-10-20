# testing.e2e.browser-automation — minimal

Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Policy grade, minimal: List the browser targets the flows run against. Unnamed targets leave compatibility untested, so name each browser and version. Binding checks: browser-automation-source-code-boundary.

Acceptance target: policy:testing.e2e.browser-automation:minimal:browser-automation-source-code-boundary.
Declared predicates: browser-automation-source-code-boundary: `browser_targets` is nonempty (a string or array).
