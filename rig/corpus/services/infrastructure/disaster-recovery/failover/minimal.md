# infrastructure.disaster-recovery.failover — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for failover. The minimal boundary for failover checks failover_trigger (nonempty): failover trigger must name the concrete repository contract.. Binding checks: failover-source-code-boundary.

Start from a repository-owned command or existing native check that can observe disaster-recovery.failover; bind it to the input named in `rig-services/infrastructure.disaster-recovery.failover.json` and preserve the check's failure status. When adopting this in an existing repository, connect failover to the command that inspects failover_trigger and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside disaster-recovery.failover as a failure.

Acceptance target: fixture:infrastructure.disaster-recovery.failover:policy-boundary. Given source-code is present and disaster-recovery.failover is selected, pass only when the repository binding evaluates disaster-recovery.failover and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent disaster recovery concern. The ceiling is failover configuration validation only; declared policy does not prove running failover behavior. Choose a repository-owned check that observes failover from rig-services/infrastructure.disaster-recovery.failover.json..

Service-specific evidence cues:
Offer: Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.
minimal: failover trigger — "primary health unavailable".
mid: fencing strategy — "single-writer-lease".
maximal: allow split brain — false.
