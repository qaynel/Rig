# intermittent rca

Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Owned scope: `flaky-reliability.intermittent-rca`.

Offer: Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Input: `rig-services/testing.flaky-reliability.intermittent-rca.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: intermittent rca configuration validation only; declared policy does not prove running intermittent rca behavior. Select an approved repository-owned command to verify that behavior.

minimal: observed conditions — ["parallel runs"].

mid: reproduction attempts — ["repeat with scheduler seed"].

maximal: blame randomness without evidence — false.
