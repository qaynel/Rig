# testing.flaky-reliability.detection-quarantine — behavior-oracle slice

Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Policy grade slice `detection-quarantine-slice-behavior-oracle`: List the tests known to be flaky. Unlisted flakes keep poisoning signal, so name each case. Despite its name this slice is not a behavior oracle: it confirms flaky cases, quarantine owners and the silent-quarantine flag are declared; it does not run the tests.
