# testing.flaky-reliability.detection-quarantine — property-floor slice

Policy grade slice. This slice bounds detection quarantine to flaky-reliability.detection-quarantine. It uses `detection-quarantine-slice-property-floor` and checks flaky_cases (nonempty): flaky cases must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.flaky-reliability.detection-quarantine.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than detection quarantine configuration validation only; declared policy does not prove running detection quarantine behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Owned scope: `flaky-reliability.detection-quarantine`.

Offer: Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Input: `rig-services/testing.flaky-reliability.detection-quarantine.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: detection quarantine configuration validation only; declared policy does not prove running detection quarantine behavior. Select an approved repository-owned command to verify that behavior.

minimal: flaky cases — ["slow websocket reconnect"].

mid: quarantine owners — ["realtime"].

maximal: silent quarantine — false.
