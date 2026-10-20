# testing.flaky-reliability.intermittent-rca — behavior-oracle slice

Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Policy grade slice `intermittent-rca-slice-behavior-oracle`: Record the conditions seen when the failure occurs, such as load or ordering. Without them the cause stays a guess, so list the correlations. Despite its name this slice is not a behavior oracle: it confirms observed conditions, reproduction attempts and the blame-randomness flag are declared; it does not reproduce the failure.
