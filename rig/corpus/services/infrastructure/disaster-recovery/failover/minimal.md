# infrastructure.disaster-recovery.failover — minimal

Define the trigger and fencing that keep failover from creating two writers. Redundant resources without split-brain protection are not a safe failover design.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for failover. The minimal boundary for failover checks failover_trigger (nonempty): failover trigger must name the concrete repository contract. Binding checks: failover-source-code-boundary.

Start from a repository-owned command or existing native check that can observe disaster-recovery.failover; bind it to the input named in `rig-services/infrastructure.disaster-recovery.failover.json` and preserve the check's failure status. When adopting this in an existing repository, connect failover to the command that inspects failover_trigger and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside disaster-recovery.failover as a failure.

Acceptance target: policy:infrastructure.disaster-recovery.failover:minimal:failover-source-code-boundary.

Declared predicates: failover-source-code-boundary: `failover_trigger` is nonempty (a string or array).
