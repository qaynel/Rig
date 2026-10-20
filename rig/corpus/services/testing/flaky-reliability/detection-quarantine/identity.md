# testing.flaky-reliability.detection-quarantine — identity

Policy grade: detection-quarantine owns flaky-reliability.detection-quarantine. Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Input: `rig-services/testing.flaky-reliability.detection-quarantine.json`. Configuration validation only, so it confirms flaky cases, quarantine owners and the silent-quarantine flag are declared; it does not run the tests.

Disposition: executable.
Acceptance target: policy:testing.flaky-reliability.detection-quarantine:minimal:detection-quarantine-source-code-boundary.
Declared predicates: detection-quarantine-source-code-boundary: `flaky_cases` is nonempty (a string or array).
