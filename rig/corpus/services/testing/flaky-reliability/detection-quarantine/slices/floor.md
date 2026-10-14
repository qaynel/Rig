# testing.flaky-reliability.detection-quarantine — floor and mutation-floor slice

Policy grade slice. This slice bounds detection quarantine to flaky-reliability.detection-quarantine. It uses `detection-quarantine-slice-floor` and checks flaky_cases (nonempty): flaky cases must name the concrete repository contract..

For detection quarantine, choose a repository example that satisfies flaky_cases at the floor and mutation-floor floor, plus a failure where flaky cases must name the concrete repository contract. is false. For detection quarantine, wire `floor and mutation-floor` to `rig-services/testing.flaky-reliability.detection-quarantine.json` and keep its verdict on flaky_cases; missing evidence is a named gap, with ceiling detection quarantine configuration validation only; declared policy does not prove running detection quarantine behavior. Choose a repository-owned check that observes detection quarantine from rig-services/testing.flaky-reliability.detection-quarantine.json..

Service-specific evidence cues:
Offer: Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.
minimal: flaky cases — ["slow websocket reconnect"].
mid: quarantine owners — ["realtime"].
maximal: silent quarantine — false.
