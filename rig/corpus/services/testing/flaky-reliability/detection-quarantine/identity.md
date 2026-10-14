# testing.flaky-reliability.detection-quarantine — identity

detection quarantine owns flaky-reliability.detection-quarantine. Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Keep sibling services in flaky-reliability under their own verdicts. Inspect the configured input at `rig-services/testing.flaky-reliability.detection-quarantine.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: detection quarantine configuration validation only; declared policy does not prove running detection quarantine behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.flaky-reliability.detection-quarantine:policy-boundary. Given source-code is present and flaky-reliability.detection-quarantine is selected, pass only when the repository binding evaluates flaky-reliability.detection-quarantine and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern.
