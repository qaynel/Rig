# testing.flaky-reliability.intermittent-rca — identity

intermittent rca owns flaky-reliability.intermittent-rca. Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Keep sibling services in flaky-reliability under their own verdicts. Start from the configured input at `rig-services/testing.flaky-reliability.intermittent-rca.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: intermittent rca configuration validation only; declared policy does not prove running intermittent rca behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.flaky-reliability.intermittent-rca:policy-boundary. Given source-code is present and flaky-reliability.intermittent-rca is selected, pass only when the repository binding evaluates flaky-reliability.intermittent-rca and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern.
