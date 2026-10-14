# testing.e2e.browser-automation — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for browser automation. The evidence must preserve the browser_targets, interaction_steps, fixed_sleeps inputs that determined the result. Binding checks: browser-automation-evidence-receipt.

Trace the verdict to a second run against unchanged browser automation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: browser automation configuration validation only; declared policy does not prove running browser automation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.e2e.browser-automation:evidence-replay. Given the e2e.browser-automation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Owned scope: `e2e.browser-automation`.

Offer: Drive real interactions and wait for observable state transitions. Fixed sleeps hide synchronization defects and produce unreliable results under slower environments.

Input: `rig-services/testing.e2e.browser-automation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: browser automation configuration validation only; declared policy does not prove running browser automation behavior. Select an approved repository-owned command to verify that behavior.

minimal: browser targets — ["chromium"].

mid: interaction steps — ["submit form"].

maximal: fixed sleeps — false.
