# testing.flaky-reliability.detection-quarantine — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for detection quarantine; it does not widen ownership beyond flaky-reliability.detection-quarantine. For detection quarantine, inspect these context signals: quarantine_owners. Binding checks: detection-quarantine-flaky-reliability-context.

Ground the decision in the existing repository's detection quarantine convention, then name the source path or command that establishes it. For detection quarantine, inspect the repository's actual spec, source, test, or configuration for quarantine_owners; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring flaky-reliability services outside the detection quarantine decision for flaky-reliability.detection-quarantine.

Acceptance target: fixture:testing.flaky-reliability.detection-quarantine:repository-context. Given flaky-reliability.detection-quarantine has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent flaky reliability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.
minimal: flaky cases — ["slow websocket reconnect"].
mid: quarantine owners — ["realtime"].
maximal: silent quarantine — false.
