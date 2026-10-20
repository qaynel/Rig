# infrastructure.scaling-reliability.chaos-engineering — property-floor slice

Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Policy grade slice. This slice bounds chaos engineering to scaling-reliability.chaos-engineering. It uses `chaos-engineering-slice-property-floor` and checks fault_scenarios (nonempty): fault scenarios must name the concrete repository contract.