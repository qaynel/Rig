# infrastructure.disaster-recovery.failover — property-floor slice

Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Policy grade slice. This slice bounds failover to disaster-recovery.failover. It uses `failover-slice-property-floor` and checks failover_trigger (nonempty): failover trigger must name the concrete repository contract.