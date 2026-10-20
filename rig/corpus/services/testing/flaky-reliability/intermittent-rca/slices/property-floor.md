# testing.flaky-reliability.intermittent-rca — property-floor slice

Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Policy grade slice. This slice bounds intermittent rca to flaky-reliability.intermittent-rca. It uses `intermittent-rca-slice-property-floor` and checks observed_conditions (nonempty): observed conditions must name the concrete repository contract.