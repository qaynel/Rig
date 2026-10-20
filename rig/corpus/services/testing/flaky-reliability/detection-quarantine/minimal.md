# testing.flaky-reliability.detection-quarantine — minimal

Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for detection quarantine. The minimal boundary for detection quarantine checks flaky_cases (nonempty): flaky cases must name the concrete repository contract. Binding checks: detection-quarantine-source-code-boundary.

Read a repository-owned command or existing native check that can observe flaky-reliability.detection-quarantine; bind it to the input named in `rig-services/testing.flaky-reliability.detection-quarantine.json` and preserve the check's failure status. When adopting this in an existing repository, connect detection quarantine to the command that inspects flaky_cases and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside flaky-reliability.detection-quarantine as a failure.

Acceptance target: policy:testing.flaky-reliability.detection-quarantine:minimal:detection-quarantine-source-code-boundary.

Declared predicates: detection-quarantine-source-code-boundary: `flaky_cases` is nonempty (a string or array).
