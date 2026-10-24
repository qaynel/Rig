# testing.flaky-reliability.intermittent-rca — identity

Policy grade: intermittent-rca owns flaky-reliability.intermittent-rca. Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Input: `rig-services/testing.flaky-reliability.intermittent-rca.json`. Configuration validation only, so it confirms observed conditions, reproduction attempts and the blame-randomness flag are declared; it does not reproduce the failure.

Disposition: executable.
Acceptance target: policy:testing.flaky-reliability.intermittent-rca:minimal:intermittent-rca-source-code-boundary.
Declared predicates: intermittent-rca-source-code-boundary: `observed_conditions` is nonempty (a string or array).
