# testing.flaky-reliability.detection-quarantine — property-floor slice

Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Policy grade slice `detection-quarantine-slice-property-floor`: List the tests known to be flaky. Unlisted flakes keep poisoning signal, so name each case.
