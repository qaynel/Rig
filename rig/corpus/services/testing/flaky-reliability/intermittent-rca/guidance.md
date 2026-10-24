# intermittent-rca

Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Owned scope: `flaky-reliability.intermittent-rca`. Input: `rig-services/testing.flaky-reliability.intermittent-rca.json`.

Coverage ceiling: Configuration validation only, so it confirms observed conditions, reproduction attempts and the blame-randomness flag are declared; it does not reproduce the failure.

minimal: observed conditions — ["parallel runs"]. Record the conditions seen when the failure occurs, such as load or ordering. Without them the cause stays a guess, so list the correlations.

mid: reproduction attempts — ["repeat with scheduler seed"]. List the reproduction attempts and what each varied. Single runs cannot separate causes, so record discriminating tries.

maximal: blame randomness without evidence — false. Set blaming randomness without evidence to false. Calling it random delays finding the scheduling or resource cause, so show data.
