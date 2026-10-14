# testing.e2e.browser-automation — floor and mutation-floor slice

Policy grade slice. This slice bounds browser automation to e2e.browser-automation. It uses `browser-automation-slice-floor` and checks browser_targets (nonempty): browser targets must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.e2e.browser-automation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than browser automation configuration validation only; declared policy does not prove running browser automation behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Owned scope: `e2e.browser-automation`.

Offer: Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Input: `rig-services/testing.e2e.browser-automation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: browser automation configuration validation only; declared policy does not prove running browser automation behavior. Select an approved repository-owned command to verify that behavior.

minimal: browser targets — ["chromium"].

mid: interaction steps — ["submit form"].

maximal: fixed sleeps — false.
