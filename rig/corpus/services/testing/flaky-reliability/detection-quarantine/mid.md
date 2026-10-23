# testing.flaky-reliability.detection-quarantine — mid

Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Policy grade, mid: Assign an owner to each quarantined test. Unowned quarantines never get fixed, so name a person or team. Cumulative with minimal. Binding checks: detection-quarantine-source-code-boundary, detection-quarantine-flaky-reliability-context.

Acceptance target: policy:testing.flaky-reliability.detection-quarantine:mid:detection-quarantine-source-code-boundary+detection-quarantine-flaky-reliability-context.
Declared predicates: detection-quarantine-source-code-boundary: `flaky_cases` is nonempty (a string or array); detection-quarantine-flaky-reliability-context: `quarantine_owners` is nonempty (a string or array).
