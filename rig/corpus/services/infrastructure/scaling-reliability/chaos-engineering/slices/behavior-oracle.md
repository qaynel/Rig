# infrastructure.scaling-reliability.chaos-engineering — behavior-oracle slice

Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Policy grade slice `chaos-engineering-slice-behavior-oracle`: List the faults that test a resilience assumption. Random breakage teaches nothing, so name each scenario and what it checks. Despite its name this slice is not a behavior oracle: it confirms fault scenarios, stop conditions and the unapproved-production flag are declared; it does not inject any fault.
