# testing.flaky-reliability.detection-quarantine — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for detection quarantine; it does not widen ownership beyond flaky-reliability.detection-quarantine. The context signals are quarantine_owners. Binding checks: detection-quarantine-flaky-reliability-context.

Ground the decision in the existing repository's detection quarantine convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in flaky-reliability under their own verdicts.

Acceptance target: fixture:testing.flaky-reliability.detection-quarantine:repository-context. Given flaky-reliability.detection-quarantine has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent flaky reliability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Owned scope: `flaky-reliability.detection-quarantine`.

Offer: Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Input: `rig-services/testing.flaky-reliability.detection-quarantine.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: detection quarantine configuration validation only; declared policy does not prove running detection quarantine behavior. Select an approved repository-owned command to verify that behavior.

minimal: flaky cases — ["slow websocket reconnect"].

mid: quarantine owners — ["realtime"].

maximal: silent quarantine — false.
