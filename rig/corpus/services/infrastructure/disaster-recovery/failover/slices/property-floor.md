# infrastructure.disaster-recovery.failover — property-floor slice

Policy grade slice. This slice bounds failover to disaster-recovery.failover. It uses `failover-slice-property-floor` and checks failover_trigger (nonempty): failover trigger must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.disaster-recovery.failover.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than failover configuration validation only; declared policy does not prove running failover behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Owned scope: `disaster-recovery.failover`.

Offer: Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Input: `rig-services/infrastructure.disaster-recovery.failover.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: failover configuration validation only; declared policy does not prove running failover behavior. Select an approved repository-owned command to verify that behavior.

minimal: failover trigger — "primary health unavailable".

mid: fencing strategy — "single-writer-lease".

maximal: allow split brain — false.
