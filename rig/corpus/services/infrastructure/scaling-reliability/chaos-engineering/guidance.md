# chaos-engineering

Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Owned scope: `scaling-reliability.chaos-engineering`. Input: `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`.

Coverage ceiling: Configuration validation only, so it confirms fault scenarios, stop conditions and the unapproved-production flag are declared; it does not inject any fault.

minimal: fault scenarios — ["worker unavailable"]. List the faults that test a resilience assumption. Random breakage teaches nothing, so name each scenario and what it checks.

mid: stop conditions — ["error budget exhausted"]. Define the conditions that stop the experiment immediately. Without them a fault can run away, so write the abort criteria.

maximal: production experiment without approval — false. Set production experiments without approval to false. Production chaos needs explicit sign-off and safeguards, so obtain it first.
