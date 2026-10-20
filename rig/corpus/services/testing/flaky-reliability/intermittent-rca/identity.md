# testing.flaky-reliability.intermittent-rca — identity

Policy grade: intermittent rca owns flaky-reliability.intermittent-rca. Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Keep neighboring flaky-reliability services outside the intermittent rca decision for flaky-reliability.intermittent-rca. Start from the configured input at `rig-services/testing.flaky-reliability.intermittent-rca.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: intermittent rca configuration validation only; declared policy does not prove running intermittent rca behavior. Choose a repository-owned check that observes intermittent rca from rig-services/testing.flaky-reliability.intermittent-rca.json.

Acceptance target: policy:testing.flaky-reliability.intermittent-rca:minimal:intermittent-rca-source-code-boundary.

Declared predicates: intermittent-rca-source-code-boundary: `observed_conditions` is nonempty (a string or array).
