# infrastructure.disaster-recovery.failover — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for failover. It checks failover_trigger (nonempty): failover trigger must name the concrete repository contract.. Binding checks: failover-source-code-boundary.

Start from a repository-owned command or existing native check that can observe disaster-recovery.failover; bind it to the input named in `rig-services/infrastructure.disaster-recovery.failover.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside disaster-recovery.failover is a failure.

Acceptance target: fixture:infrastructure.disaster-recovery.failover:policy-boundary. Given source-code is present and disaster-recovery.failover is selected, pass only when the repository binding evaluates disaster-recovery.failover and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Owned scope: `disaster-recovery.failover`.

Offer: Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Input: `rig-services/infrastructure.disaster-recovery.failover.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: failover configuration validation only; declared policy does not prove running failover behavior. Select an approved repository-owned command to verify that behavior.

minimal: failover trigger — "primary health unavailable".

mid: fencing strategy — "single-writer-lease".

maximal: allow split brain — false.
