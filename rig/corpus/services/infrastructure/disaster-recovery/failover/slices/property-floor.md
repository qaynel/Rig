# infrastructure.disaster-recovery.failover — property-floor slice

Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Policy grade slice `failover-slice-property-floor`: Define what triggers failover. An undefined trigger means failover is manual or accidental, so state the health condition.
