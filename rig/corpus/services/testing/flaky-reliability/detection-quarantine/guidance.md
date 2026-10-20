# detection quarantine

Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Owned scope: `flaky-reliability.detection-quarantine`.

Offer: Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Input: `rig-services/testing.flaky-reliability.detection-quarantine.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: detection quarantine configuration validation only; declared policy does not prove running detection quarantine behavior. Select an approved repository-owned command to verify that behavior.

minimal: flaky cases — ["slow websocket reconnect"].

mid: quarantine owners — ["realtime"].

maximal: silent quarantine — false.
