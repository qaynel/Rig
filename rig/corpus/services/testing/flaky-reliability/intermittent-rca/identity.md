# testing.flaky-reliability.intermittent-rca — identity

Policy grade: intermittent rca owns flaky-reliability.intermittent-rca. Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Keep neighboring flaky-reliability services outside the intermittent rca decision for flaky-reliability.intermittent-rca. Start from the configured input at `rig-services/testing.flaky-reliability.intermittent-rca.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: intermittent rca configuration validation only; declared policy does not prove running intermittent rca behavior. Choose a repository-owned check that observes intermittent rca from rig-services/testing.flaky-reliability.intermittent-rca.json.

Acceptance target: fixture:testing.flaky-reliability.intermittent-rca:policy-boundary. Given source-code is present and flaky-reliability.intermittent-rca is selected, pass only when the repository binding evaluates flaky-reliability.intermittent-rca and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern.

Service-specific evidence cues:
Offer: Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.
minimal: observed conditions — ["parallel runs"].
mid: reproduction attempts — ["repeat with scheduler seed"].
maximal: blame randomness without evidence — false.
