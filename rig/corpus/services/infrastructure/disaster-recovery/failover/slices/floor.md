# infrastructure.disaster-recovery.failover — floor and mutation-floor slice

Policy grade slice. This slice bounds failover to disaster-recovery.failover. It uses `failover-slice-floor` and checks failover_trigger (nonempty): failover trigger must name the concrete repository contract..

For failover, choose a repository example that satisfies failover_trigger at the floor and mutation-floor floor, plus a failure where failover trigger must name the concrete repository contract. is false. For failover, wire `floor and mutation-floor` to `rig-services/infrastructure.disaster-recovery.failover.json` and keep its verdict on failover_trigger; missing evidence is a named gap, with ceiling failover configuration validation only; declared policy does not prove running failover behavior. Choose a repository-owned check that observes failover from rig-services/infrastructure.disaster-recovery.failover.json..

Service-specific evidence cues:
Offer: Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.
minimal: failover trigger — "primary health unavailable".
mid: fencing strategy — "single-writer-lease".
maximal: allow split brain — false.
