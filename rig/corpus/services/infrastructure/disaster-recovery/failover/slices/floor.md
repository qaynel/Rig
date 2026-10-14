# infrastructure.disaster-recovery.failover — floor and mutation-floor slice

This slice bounds failover to disaster-recovery.failover. It uses `failover-slice-floor` and checks failover_trigger (nonempty): failover trigger must name the concrete repository contract..

Read a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.disaster-recovery.failover.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than failover configuration validation only; declared policy does not prove running failover behavior. Select an approved repository-owned command to verify that behavior.
