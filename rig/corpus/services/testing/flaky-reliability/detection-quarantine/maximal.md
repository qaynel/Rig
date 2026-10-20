# testing.flaky-reliability.detection-quarantine — maximal

Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: detection-quarantine-source-code-boundary, detection-quarantine-flaky-reliability-context, detection-quarantine-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.flaky-reliability.detection-quarantine:maximal:detection-quarantine-source-code-boundary+detection-quarantine-flaky-reliability-context+detection-quarantine-evidence-receipt.

Declared predicates: detection-quarantine-source-code-boundary: `flaky_cases` is nonempty (a string or array); detection-quarantine-flaky-reliability-context: `quarantine_owners` is nonempty (a string or array); detection-quarantine-evidence-receipt: `silent_quarantine` equals false.
