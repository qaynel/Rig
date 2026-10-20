# testing.flaky-reliability.detection-quarantine — identity

Policy grade: detection quarantine owns flaky-reliability.detection-quarantine. Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Keep neighboring flaky-reliability services outside the detection quarantine decision for flaky-reliability.detection-quarantine. Inspect the configured input at `rig-services/testing.flaky-reliability.detection-quarantine.json`; malformed input is still attributed to that path.

Disposition: executable. Tie acceptance to the limit: detection quarantine configuration validation only; declared policy does not prove running detection quarantine behavior. Choose a repository-owned check that observes detection quarantine from rig-services/testing.flaky-reliability.detection-quarantine.json.

Acceptance target: policy:testing.flaky-reliability.detection-quarantine:minimal:detection-quarantine-source-code-boundary.

Declared predicates: detection-quarantine-source-code-boundary: `flaky_cases` is nonempty (a string or array).
