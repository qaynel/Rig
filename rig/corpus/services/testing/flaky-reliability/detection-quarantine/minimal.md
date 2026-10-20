# testing.flaky-reliability.detection-quarantine — minimal

Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Policy grade, minimal: List the tests known to be flaky. Unlisted flakes keep poisoning signal, so name each case. Binding checks: detection-quarantine-source-code-boundary.

Acceptance target: policy:testing.flaky-reliability.detection-quarantine:minimal:detection-quarantine-source-code-boundary.
Declared predicates: detection-quarantine-source-code-boundary: `flaky_cases` is nonempty (a string or array).
