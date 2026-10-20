# testing.flaky-reliability.detection-quarantine — mid

Track intermittent failures with an owner and a visible quarantine reason. Quarantine contains unreliable signal; it does not erase the failure or close the underlying defect.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: detection-quarantine-source-code-boundary, detection-quarantine-flaky-reliability-context.

Ground the decision in the existing repository's detection quarantine convention, then name the source path or command that establishes it. For detection quarantine, inspect the repository's actual spec, source, test, or configuration for quarantine_owners; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring flaky-reliability services outside the detection quarantine decision for flaky-reliability.detection-quarantine.

Acceptance target: policy:testing.flaky-reliability.detection-quarantine:mid:detection-quarantine-source-code-boundary+detection-quarantine-flaky-reliability-context.

Declared predicates: detection-quarantine-source-code-boundary: `flaky_cases` is nonempty (a string or array); detection-quarantine-flaky-reliability-context: `quarantine_owners` is nonempty (a string or array).
