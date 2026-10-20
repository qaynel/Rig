# testing.flaky-reliability.detection-quarantine — maximal

Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Policy grade, maximal: Set silent quarantine to false. A hidden quarantine erases the failure and leaves the defect open, so record the reason visibly. Cumulative with minimal and mid. Binding checks: detection-quarantine-source-code-boundary, detection-quarantine-flaky-reliability-context, detection-quarantine-evidence-receipt.

Acceptance target: policy:testing.flaky-reliability.detection-quarantine:maximal:detection-quarantine-source-code-boundary+detection-quarantine-flaky-reliability-context+detection-quarantine-evidence-receipt.
Declared predicates: detection-quarantine-source-code-boundary: `flaky_cases` is nonempty (a string or array); detection-quarantine-flaky-reliability-context: `quarantine_owners` is nonempty (a string or array); detection-quarantine-evidence-receipt: `silent_quarantine` equals false.
