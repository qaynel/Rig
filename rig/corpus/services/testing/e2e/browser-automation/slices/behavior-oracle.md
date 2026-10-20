# testing.e2e.browser-automation — behavior-oracle slice

Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Policy grade slice `browser-automation-slice-behavior-oracle`: List the browser targets the flows run against. Unnamed targets leave compatibility untested, so name each browser and version. Despite its name this slice is not a behavior oracle: it confirms browser targets, interaction steps and the fixed-sleep flag are declared; it does not drive a browser.
