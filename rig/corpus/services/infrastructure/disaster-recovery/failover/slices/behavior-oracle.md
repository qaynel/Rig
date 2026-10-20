# infrastructure.disaster-recovery.failover — behavior-oracle slice

Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Policy grade slice `failover-slice-behavior-oracle`: Define what triggers failover. An undefined trigger means failover is manual or accidental, so state the health condition. Despite its name this slice is not a behavior oracle: it confirms the failover trigger, fencing strategy and the split-brain flag are declared; it does not show failover works.
