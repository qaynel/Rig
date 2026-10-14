# testing.flaky-reliability.detection-quarantine — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for detection quarantine. The minimal boundary for detection quarantine checks flaky_cases (nonempty): flaky cases must name the concrete repository contract.. Binding checks: detection-quarantine-source-code-boundary.

Read a repository-owned command or existing native check that can observe flaky-reliability.detection-quarantine; bind it to the input named in `rig-services/testing.flaky-reliability.detection-quarantine.json` and preserve the check's failure status. When adopting this in an existing repository, connect detection quarantine to the command that inspects flaky_cases and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside flaky-reliability.detection-quarantine as a failure.

Acceptance target: fixture:testing.flaky-reliability.detection-quarantine:policy-boundary. Given source-code is present and flaky-reliability.detection-quarantine is selected, pass only when the repository binding evaluates flaky-reliability.detection-quarantine and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern. The ceiling is detection quarantine configuration validation only; declared policy does not prove running detection quarantine behavior. Choose a repository-owned check that observes detection quarantine from rig-services/testing.flaky-reliability.detection-quarantine.json..

Service-specific evidence cues:
Offer: Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.
minimal: flaky cases — ["slow websocket reconnect"].
mid: quarantine owners — ["realtime"].
maximal: silent quarantine — false.
