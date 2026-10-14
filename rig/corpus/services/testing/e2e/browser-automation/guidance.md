# browser automation

Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Owned scope: `e2e.browser-automation`.

Offer: Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Input: `rig-services/testing.e2e.browser-automation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: browser automation configuration validation only; declared policy does not prove running browser automation behavior. Select an approved repository-owned command to verify that behavior.

minimal: browser targets — ["chromium"].

mid: interaction steps — ["submit form"].

maximal: fixed sleeps — false.

