# browser-automation

Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Owned scope: `e2e.browser-automation`. Input: `rig-services/testing.e2e.browser-automation.json`.

Coverage ceiling: Configuration validation only, so it confirms browser targets, interaction steps and the fixed-sleep flag are declared; it does not drive a browser.

minimal: browser targets — ["chromium"]. List the browser targets the flows run against. Unnamed targets leave compatibility untested, so name each browser and version.

mid: interaction steps — ["submit form"]. Write the interaction steps as observable actions. Vague steps cannot be replayed, so list each click, input and expected state.

maximal: fixed sleeps — false. Set fixed sleeps to false. A sleep hides synchronization defects and flakes on slower machines, so wait on an observable state.
