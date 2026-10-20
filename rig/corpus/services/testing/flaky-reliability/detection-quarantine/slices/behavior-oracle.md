# testing.flaky-reliability.detection-quarantine — behavior-oracle slice

Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Policy grade slice. This slice bounds detection quarantine to flaky-reliability.detection-quarantine. It uses `detection-quarantine-slice-behavior-oracle` and checks flaky_cases (nonempty): flaky cases must name the concrete repository contract.