# detection-quarantine

Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Owned scope: `flaky-reliability.detection-quarantine`. Input: `rig-services/testing.flaky-reliability.detection-quarantine.json`.

Coverage ceiling: Configuration validation only, so it confirms flaky cases, quarantine owners and the silent-quarantine flag are declared; it does not run the tests.

minimal: flaky cases — ["slow websocket reconnect"]. List the tests known to be flaky. Unlisted flakes keep poisoning signal, so name each case.

mid: quarantine owners — ["realtime"]. Assign an owner to each quarantined test. Unowned quarantines never get fixed, so name a person or team.

maximal: silent quarantine — false. Set silent quarantine to false. A hidden quarantine erases the failure and leaves the defect open, so record the reason visibly.
